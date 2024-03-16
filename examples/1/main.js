import * as NN from "./nn.js"

let Network = new NN.Network();

Network.add("Input",null,NN.ScaleFunctions[0]);
Network.add("Output",null,NN.ScaleFunctions[0]);

Network.connect(0,1,1,NN.ScaleFunctions[0]);

Network.InputNeurons[0].Function_value = 5;

Network.calculateConnectionsPlay();


