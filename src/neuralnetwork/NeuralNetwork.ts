import { ArrayMap } from "./ArrayMap";

class ActivationFunction {
  public func;
  public dfunc;
  constructor(func: any, dfunc: any) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  (x: number) => 1 / (1 + Math.exp(-x)),
  (y: number) => y * (1 - y)
);

let tanh = new ActivationFunction(
  (x: number) => Math.tanh(x),
  (y: number) => 1 - y * y
);

// Standard Normal variate using Box-Muller transform.
const randomGaussian = (mean = 0, stdev = 1) => {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
};

export class NeuralNetwork {
  protected input_nodes: number;
  protected hidden_nodes: number;
  protected output_nodes: number;

  protected weights_ih: ArrayMap;
  protected weights_ho: ArrayMap;
  protected bias_h: ArrayMap;
  protected bias_o: ArrayMap;

  protected activation_function: ActivationFunction;
  protected learning_rate: number = 0;

  constructor(
    props: number | NeuralNetwork,
    hidden_nodes?: number,
    output_nodes?: number
  ) {
    if (props instanceof NeuralNetwork) {
      this.input_nodes = props.input_nodes;
      this.hidden_nodes = props.hidden_nodes;
      this.output_nodes = props.output_nodes;

      this.weights_ih = props.weights_ih.copy();
      this.weights_ho = props.weights_ho.copy();

      this.bias_h = props.bias_h.copy();
      this.bias_o = props.bias_o.copy();
    } else {
      this.input_nodes = props;
      this.hidden_nodes = hidden_nodes!;
      this.output_nodes = output_nodes!;

      this.weights_ih = new ArrayMap(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new ArrayMap(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new ArrayMap(this.hidden_nodes, 1);
      this.bias_o = new ArrayMap(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();
    }

    this.setLearningRate();
    this.activation_function = sigmoid;
  }

  predict(input_array: number[]) {
    // Generating the Hidden Outputs
    let inputs = ArrayMap.fromArray(input_array);
    let hidden = ArrayMap.multiply(this.weights_ih, inputs);
    hidden?.add(this.bias_h);
    // activation function!
    hidden?.map(this.activation_function.func);

    // Generating the output's output!
    let output = ArrayMap.multiply(this.weights_ho, hidden!);
    output?.add(this.bias_o);
    output?.map(this.activation_function.func);

    // Sending back to the caller!
    return output?.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  train(input_array: number[], target_array: number[]) {
    // Generating the Hidden Outputs
    let inputs = ArrayMap.fromArray(input_array);
    let hidden = ArrayMap.multiply(this.weights_ih, inputs);
    hidden?.add(this.bias_h);
    // activation function!
    hidden?.map(this.activation_function.func);

    // Generating the output's output!
    let outputs = ArrayMap.multiply(this.weights_ho, hidden!);
    outputs?.add(this.bias_o);
    outputs?.map(this.activation_function.func);

    // Convert array to matrix object
    let targets = ArrayMap.fromArray(target_array);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = ArrayMap.subtract(targets, outputs!);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = ArrayMap.map(outputs!, this.activation_function.dfunc);
    gradients.multiply(output_errors!);
    gradients.multiply(this.learning_rate);

    // Calculate deltas
    let hidden_T = ArrayMap.transpose(hidden!);
    let weight_ho_deltas = ArrayMap.multiply(gradients, hidden_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas!);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

    // Calculate the hidden layer errors
    let who_t = ArrayMap.transpose(this.weights_ho);
    let hidden_errors = ArrayMap.multiply(who_t, output_errors!);

    // Calculate hidden gradient
    let hidden_gradient = ArrayMap.map(hidden!, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors!);
    hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = ArrayMap.transpose(inputs);
    let weight_ih_deltas = ArrayMap.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas!);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);

    // outputs.print();
    // targets.print();
    // error.print();
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data: any) {
    if (typeof data == "string") {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(
      data.input_nodes,
      data.hidden_nodes,
      data.output_nodes
    );
    nn.weights_ih = ArrayMap.deserialize(data.weights_ih);
    nn.weights_ho = ArrayMap.deserialize(data.weights_ho);
    nn.bias_h = ArrayMap.deserialize(data.bias_h);
    nn.bias_o = ArrayMap.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }

  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  mutate(rate: number) {
    function mutate(val: number) {
      if (Math.random() < rate) {
        // return 2 * Math.random() - 1;
        return val + randomGaussian(0, 0.1);
      } else {
        return val;
      }
    }
    this.weights_ih.map(mutate);
    this.weights_ho.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
  }
}
