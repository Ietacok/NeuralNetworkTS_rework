const PIInverse2Root = Math.sqrt(2 / Math.PI);

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function tanh(x) {
    return Math.tanh(x);
}

function relu(x) {
    return Math.max(0, x);
}

function leakyRelu(x) {
    return x > 0 ? x : 0.01 * x; // You can adjust the slope (0.01) as needed
}

function softplus(x) {
    return Math.log(1 + Math.exp(x));
}

function elu(x, alpha = 1.0) {
    return x > 0 ? x : alpha * (Math.exp(x) - 1);
}

function gelu(x) {
    return 0.5 * x * (1 + Math.tanh(PIInverse2Root * (x + 0.044715 * Math.pow(x, 3))));
}

function swish(x) {
    return x * sigmoid(x);
}

function softsign(x) {
    return x / (1 + Math.abs(x));
}

function identity(x) {
    return x;
}

export let ScalingFunctions = [
    identity, // Adding identity function for completeness
    sigmoid,
    tanh,
    relu,
    leakyRelu,
    softplus,
    elu,
    gelu,
    swish,
    softsign
];