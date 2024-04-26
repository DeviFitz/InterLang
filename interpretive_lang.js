const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let stack = [];

const err = (str) => {
    console.log(str);
    process.exit(1);
};

const handleName = async () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter string: ', (input) => {
            stack.push(input);
            resolve();
        });
    });
};


const handleTip = async () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter an integer: ', (input) => {
            const num = parseInt(input);
            if (!isNaN(num)) {
                stack.push(num);
                resolve();
            } else {
                console.log("Error: Invalid input. Please enter an integer.");
                reject();
            }
        });
    });
};

const handleGreeting = (characters) => {
    characters.split('').forEach(char => {
        stack.push(char.charCodeAt(0));
    });
};

//handleorder converts the stack to ascii
const handleOrder = () => {
    const asciiChars = stack.map(charCode => String.fromCharCode(charCode));
    console.log(asciiChars.join(''));

};

//stright just prints the stack
const handleOrderStright = () => {
    console.log(stack.join(''));
};


const handleReceipt = () => {
    if (stack.length < 2) {
        console.log("Error: Insufficient elements in stack for RECEIPT command");
        return;
    }

    const repeatCount = stack.pop();
    const valueToRepeat = stack.pop();

    const repeatedValues = String(valueToRepeat).repeat(repeatCount);
    stack.push(...repeatedValues.split('').map(Number));
    console.log(stack.join(''));
};


const handlePour = () => {
    stack = stack.map(item => item.split('').reverse().join(''));
};



const handleMocha = () => {
    if (stack.length < 2) {
        err("Error: Insufficient elements in stack for MOCHA command");
    }
    const b = parseFloat(stack.pop());
    const a = parseFloat(stack.pop());
    stack.push(a * b);
};


const interpret = async (lines) => {
    for (const line of lines) {
        const trimmedLine = line.trim(); // Remove any leading/trailing whitespace
        if (trimmedLine === '') continue; // Skip empty lines
        const parts = trimmedLine.split(" ");
        const instr = parts[0];
        const args = parts.slice(1).join(' ');

        switch (instr) {
            case "NAME":
                await handleName();
                break;
            case "TIP":
                await handleTip();
                break;
            case "GREETING":
                handleGreeting(args);
                break;
            case "ORDER":
                handleOrder();
                break;
            case "STRIGHTORDER":
                handleOrderStright();
                break;
            case "RECEIPT":
                handleReceipt();
                break;
            case "POUR":
                handlePour();
                break;
            case "MOCHA":
                handleMocha();
                break;
            case "BLACK":
                process.exit(0);
            default:
                console.log("Invalid instruction:", instr);
                process.exit(1);
        }
    }
};

// Check if a filename is provided as a command-line argument
if (process.argv.length > 2) {
    const fileName = process.argv[2];
    try {
        const lines = fs.readFileSync(fileName, 'utf8').split('\r\n');
        interpret(lines);
    } catch (error) {
        console.log("Error while opening file:\n", error);
        process.exit(1);
    }
} else {
    console.log("Please provide a filename as a command-line argument.");
    process.exit(1);
}
