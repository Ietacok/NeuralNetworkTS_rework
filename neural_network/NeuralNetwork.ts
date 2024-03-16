import * as ScalingFunctions from "./ScalingFunctions.ts";

type ScalingFunction = (number) => number;
type CallbackFunc = (number) => number;
type ActivationFunc = (number) => number;

class Neuron
{
 Last_nominal: number = 0;
 Function_value: number = 0;
 ScalingFunction: ScalingFunction;

 Iteration: number = 0;
 SubIteration: number = 0;
 MaxSubIterations: number = 0;

 constructor(LastNominal: number, MaxSubIterations,ScalingFunction: ScalingFunction)
 {
    if (ScalingFunction == null)
    {
     ScalingFunction = ScalingFunctions[0];
    }
    this.ScalingFunction = ScalingFunction;
    this.Last_nominal = LastNominal;
    this.MaxSubIterations = MaxSubIterations;
 }
}

class Connection
{
 NeuronId1: number;
 NeuronId2: number;
 ConnectionWeight : number;
 ScalingFunction : ScalingFunction;

 constructor(NeuronId1: number,NeuronId2: number,ConnectionWeight : number = 1,ScalingFunction : ScalingFunction)
 {
  if (ScalingFunction == null)
  {
   ScalingFunction = ScalingFunctions[0];
  }
  this.ScalingFunction = ScalingFunction;
  this.ConnectionWeight = ConnectionWeight;
  this.NeuronId1 = NeuronId1;
  this.NeuronId2 = NeuronId2;
 }
}

class Network
{
 CurrentIteration : number = 0;

 Neurons : Neuron[] = [];

 InputNeurons : Neuron[] = [];
 InputNeuronsCallbackFunc : CallbackFunc[];

 OutputNeurons : Neuron[] = [];
 OutputNeuronsIsActivated : ActivationFunc[]; //this feature allows for the AI to perform multiple outputs at the same time

 Connections : Connection[][]; //[Neuron1Id][num] :  Connection
 ConnectionsBack : Connection[][]; //[Neuron2Id][num] : Connection

 CalculatedConnectionsPlay : Connection[]; 

 processConnection(Connection: Connection)
 {

 }

 calculateConnectionsPlay() //This allows to put the neural network into 1 dimensional array, which can easily be processed.
 {
  
 }

 destroy(NeurondId : number)
 {
  
 }

 add(Type : string,CallbackFunc: CallbackFunc | null = null,NeuronScalingFunction : ScalingFunction | null)
 {
  
 }

 disconnect(NeurondId1: number,NeurondId2: number) 
 {
  
 }

 connect(NeurondId1: number,NeurondId2: number,Weight: number,ScalingFunction: ScalingFunction) : Connection
 {
  let Connections = this.Connections[NeurondId1];
  let Connection_ = new Connection(NeurondId1,NeurondId2,Weight,ScalingFunction);
  
  if (!Connections)
  {
    this.Connections[NeurondId1] = [];
    this.Connections[NeurondId1][NeurondId2] = Connection_;

    this.ConnectionsBack[NeurondId2] = this.ConnectionsBack[NeurondId2] || [];
    this.ConnectionsBack[NeurondId2][NeurondId1] = Connection_;

    return Connection_;
  }

  let Connection_2 = Connections[NeurondId2];
 
  if (!Connection_2)
  {
    this.Connections[NeurondId1][NeurondId2] = Connection_;

    this.ConnectionsBack[NeurondId2] = this.ConnectionsBack[NeurondId2] || [];
    this.ConnectionsBack[NeurondId2][NeurondId1] = Connection_;

    return Connection_;
  }

  return Connection_2;
 }

 predict_value(): boolean {
    if (this.CalculatedConnectionsPlay.length === 0) {
        console.error("For the function predict_value to work, you must calculate CalculatedConnectionsPlay.");
        return false;
    }

    for (let i = 0; i < this.CalculatedConnectionsPlay.length; i++) {
        let Connection : Connection = this.CalculatedConnectionsPlay[i];
        this.processConnection(Connection);
    }

    return true;
}

 iterate() 
 {
  let Success = this.predict_value();

  if (!Success)
  {
   return null; 
  }

  let ActiavatedOutputNeurons: Neuron[] = [];
  let ActivationValues: number[] = []; //this adds flexibility to your model

  for (let out_neuron_id = 0;out_neuron_id < this.OutputNeurons.length;out_neuron_id++)
  {
   let OutputNeuron = this.OutputNeurons[out_neuron_id];
   let ActivationValue = this.OutputNeuronsIsActivated[out_neuron_id](OutputNeuron.Function_value);
   if (ActivationValue == 0)
   {
    continue;
   } 
   ActivationValues.push(ActivationValue);
   ActiavatedOutputNeurons.push(OutputNeuron);
  }

  return {
    ActiavatedOutputNeurons: ActiavatedOutputNeurons,
    ActivationValues: ActivationValues
  }
 }

 backpropagate(ExpectedOutput,OptimalMinimumSeekerMethod)
 {
  if (OptimalMinimumSeekerMethod == "GradientDescent")
  {

  }
 }

 randomModification() //can be useful in exiting local minimas of the function and perhaps find the global minima
 {

 }

 constructor()
 {

 }
}