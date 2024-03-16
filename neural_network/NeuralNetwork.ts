import * as ScalingFunctions from "./ScalingFunctions.ts";

type ScalingFunction = (number) => number;
type CallbackFunc = (number) => number;
type ActivationFunc = (number) => number;

export class Neuron
{
 Last_nominal: number = 0;
 Function_value: number = 0;
 ScalingFunction: ScalingFunction;

 Iteration: number = 0;
 SubIteration: number = 0; //Used only for building of the CalculatedConnectionsPlay
 MaxSubIterations: number = 1; //Used only for building of the CalculatedConnectionsPlay

 Index: number = 0;

 constructor(LastNominal: number = 0, MaxSubIterations : number = 1,ScalingFunction: ScalingFunction = ScalingFunctions[0])
 {
    this.ScalingFunction = ScalingFunction;
    this.Last_nominal = LastNominal;
    this.MaxSubIterations = MaxSubIterations;
 }
}

export class Connection
{
 NeuronId1: number;
 NeuronId2: number;
 ConnectionWeight : number;
 ScalingFunction : ScalingFunction;

 constructor(NeuronId1: number,NeuronId2: number,ConnectionWeight : number = 1,ScalingFunction : ScalingFunction = ScalingFunctions[0])
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

export class Network
{
 CurrentIteration : number = 0;

 Neurons : Neuron[] = [];

 InputNeurons : Neuron[] = []; //Rule for updating CurrentIteration within input neurons is a bit loose. (the update might happen depending on how the neural network is built, but this feature nontheless was in intentions and also came in handy with setting values for the input neurons)

 OutputNeurons : Neuron[] = [];
 OutputNeuronsIsActivated : ActivationFunc[] = []; //this feature allows for the AI to perform multiple outputs at the same time

 Connections : Connection[][] = []; //[Neuron1Id][num] :  Connection
 ConnectionsBack : Connection[][] = []; //[Neuron2Id][num] : Connection

 CalculatedConnectionsPlay : Connection[] = []; 

 processConnection(Connection: Connection)
 {
  let NeuronA = this.Neurons[Connection.NeuronId1];
  let NeuronB = this.Neurons[Connection.NeuronId2];

  let Val1 = Connection.ScalingFunction((NeuronA.ScalingFunction(NeuronA.Function_value) + NeuronA.Last_nominal) * Connection.ConnectionWeight);

  if (NeuronB.Iteration != this.CurrentIteration)
  {
   NeuronB.Iteration = this.CurrentIteration;
   NeuronB.Function_value = Val1;
  }

  NeuronB.Function_value += Val1;
 }

 calculateConnectionsPlay() //This allows to put the neural network into 1 dimensional array, which can easily be processed.
 {
  this.CurrentIteration += 1;
  let CalculatedConnectionsPlayNew : Connection[] = [];
  let NextIterable : Neuron[] = []; //replaces Iterable after the end of for loop
  let Iteratable = this.InputNeurons;
  while (Iteratable.length > 0)
  {
   for (let i = 0;i < Iteratable.length;i++)
   {
    let Neuron : Neuron = Iteratable[i];
    if (Neuron.Iteration != this.CurrentIteration)
    {
      Neuron.Iteration = this.CurrentIteration;
      Neuron.SubIteration = 0;
    }
    else if(Neuron.SubIteration == Neuron.MaxSubIterations)
    {
     continue;
    }
    Neuron.SubIteration += 1;
    let Connections = this.Connections[Neuron.Index];
    if (!Connections)
    {
     continue;
    }
    
    Connections.forEach(Connection => {
     
      if (Connection == undefined)
      {
       return 
      }

     let Neuron : Neuron = this.Neurons[Connection.NeuronId2];

     NextIterable.push(Neuron);
     CalculatedConnectionsPlayNew.push(Connection);
    })

   } 
   Iteratable = NextIterable;
  }
  this.CalculatedConnectionsPlay = CalculatedConnectionsPlayNew;
 }

 destroy(NeuronId : number) 
 {
  let Connections = this.Connections[NeuronId];

  if (Connections)
  {
   Connections.forEach(Connection => {
    if (!Connection)
    {
     return; 
    }
    this.disconnect(Connection);
   }) 
  }

  let Neuron = this.Neurons[NeuronId];
  let InnerIndex = Neuron.Index;

  let Ind = this.InputNeurons.findIndex((Neuron2) => {
   return Neuron === Neuron2;
  });

  if (Ind > 0)
  {
    this.InputNeurons[Ind] = this.InputNeurons[this.InputNeurons.length-1];
    this.InputNeurons.pop();
  }
  else if (Ind == 0)
  {
    this.InputNeurons.pop();
  }


   Ind = this.OutputNeurons.findIndex((Neuron2) => {
    return Neuron === Neuron2;
   });
 
   if (Ind > 0)
   {
     this.OutputNeurons[Ind] = this.OutputNeurons[this.OutputNeurons.length-1];
     this.OutputNeurons.pop();
   }
   else if (Ind == 0)
   {
     this.OutputNeurons.pop();
   }
 
   for (let i = InnerIndex;i < this.Neurons.length-1;i++)
   {
    this.Neurons[i] = this.Neurons[i+1];
    this.Neurons[i].Index -= 1;
   }

   this.Neurons.pop();
 }

 add(Type : string,CallbackFunc: any = null,NeuronScalingFunction : ScalingFunction)
 {
  let Neuron_ = new Neuron(0,0,NeuronScalingFunction);

  if (Type == "Input")
  {
   this.InputNeurons.push(Neuron_);
  }
  else if (Type == "Output")
  {
   this.OutputNeurons.push(Neuron_);
   this.OutputNeuronsIsActivated = CallbackFunc;
  }

  this.Neurons.push(Neuron_);

  Neuron_.Index = this.Neurons.length-1;

  return Neuron_;
 }

 disconnect(Connection: Connection) 
 {
  this.Connections[Connection.NeuronId1].slice(Connection.NeuronId2,Connection.NeuronId2);
  this.ConnectionsBack[Connection.NeuronId2].slice(Connection.NeuronId1,Connection.NeuronId1);
 }

 connect(NeuronId1: number,NeuronId2: number,Weight: number,ScalingFunction: ScalingFunction) : Connection
 {
  let Connections = this.Connections[NeuronId1];
  let Connection_ = new Connection(NeuronId1,NeuronId2,Weight,ScalingFunction);
  
  if (!Connections)
  {
    this.Connections[NeuronId1] = [];
    this.Connections[NeuronId1][NeuronId2] = Connection_;

    this.ConnectionsBack[NeuronId2] = this.ConnectionsBack[NeuronId2] || [];
    this.ConnectionsBack[NeuronId2][NeuronId1] = Connection_;

    return Connection_;
  }

  let Connection_2 = Connections[NeuronId2];
 
  if (!Connection_2)
  {
    this.Connections[NeuronId1][NeuronId2] = Connection_;

    this.ConnectionsBack[NeuronId2] = this.ConnectionsBack[NeuronId2] || [];
    this.ConnectionsBack[NeuronId2][NeuronId1] = Connection_;

    return Connection_;
  }

  return Connection_2;
 }

 predictValue(): boolean {
    if (this.CalculatedConnectionsPlay.length === 0) {
        console.error("For the function predict_value to work, you must calculate CalculatedConnectionsPlay.");
        return false;
    }

    this.CurrentIteration += 1;

    for (let i = 0; i < this.CalculatedConnectionsPlay.length; i++) {
        let Connection : Connection = this.CalculatedConnectionsPlay[i];
        this.processConnection(Connection);
    }

    return true;
 }

 iterate() 
 {
  let Success = this.predictValue();

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

export let ScaleFunctions = ScalingFunctions;