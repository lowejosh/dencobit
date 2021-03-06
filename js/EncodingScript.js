// Global Variables
let taArray = new Array();      // Array for all denco objects
let textBuffer;                 // Text buffer for all textareas

// Create a denco object
function denco(dom, encFunc, decFunc) {
    this.dom = dom;             // DOM element
    this.encFunc = encFunc;     // Encoding function
    this.decFunc = decFunc;     // Decoding function
}

// Create all denco objects and place them into the global array for easier manipulation
taArray.push(new denco(document.getElementById("ascii"), encodeASCII, decodeASCII));
taArray.push(new denco(document.getElementById("binary"), encodeBinary, decodeBinary));
taArray.push(new denco(document.getElementById("hexadecimal"), encodeHexadecimal, decodeHexadecimal));
taArray.push(new denco(document.getElementById("decimal"), encodeDecimal, decodeDecimal));
taArray.push(new denco(document.getElementById("base64"), encodeBase64, decodeBase64));
taArray.push(new denco(document.getElementById("url"), encodeURL, decodeURL));

// Initialize the placeholder values
textChanged(0);

// Update the text buffer whenever a textarea is changed
function textChanged(inputID) {
    let curr_edit = taArray[inputID];

    // Decode to ASCII and update text buffer
    textBuffer = curr_edit.decFunc(curr_edit.dom.value);            

    // Force text buffer onto all other textarea DOM elements
    for (i = 0; i < taArray.length; i++) {
        // If the input isn't the one currently being edited
        if (i != inputID) {
            // Select the object and encode the text buffer onto it's DOM value
            let obj = taArray[i];
            obj.dom.value = obj.encFunc(textBuffer);

            // (Kills a potential bug)
            if (curr_edit.dom.value.length == 0) {
                obj.dom.value = "";
            }
        }
    }
}

// Select text
function Select(inputID) {
    taArray[inputID].dom.select();
}

// ========== Encoding functions (All are developed under the context of receiving ASCII input) ==========
function encodeASCII(input) {
    return input;
}

function encodeBinary(input) {
    // Split the input to be encoded character by character
    return input.split('').map(function (char) {
        // Find the character's numeric value and convert it to base 2
        let binary = char.charCodeAt(0).toString(2);   
        // Add the zeroes that were removed
        while (binary.length < 8) {
            binary = '0' + binary; 
        }
        return binary;
    // Join the strings - separated by spaces
    }).join(' ');
}

function encodeHexadecimal(input) {
    return input.split('').map(function (char) {
        return char.charCodeAt(0).toString(16);
    }).join(' ');
}

function encodeDecimal(input) {
    return input.split('').map(function (char) {
        return char.charCodeAt(0).toString(10);
    }).join(' ');
}

function encodeBase64(input) {
    return btoa(input);
}

function encodeURL(input) {
    return encodeURIComponent(input).replace(/%20/g,'+');
}

// ========== Decoding functions (All are developed under the context of returning ASCII output) ==========
function decodeASCII(input) {
    return input;
}

function decodeBinary(input) {
    // Trim the input of whitespace and split into bytes as per 8th position
    let binary = input.replace(/\s/g,"").match(new RegExp('.{1,8}', 'g'));

    let ascii = [];

    if (binary == null) {
        return "";
    } else {
        for (i = 0; i < binary.length; i++) {
            ascii.push(String.fromCharCode(parseInt(binary[i], 2)));
        }
    }
    return ascii.join("");
}

function decodeHexadecimal(input) {
    // Trim the input of whitespace and split into hex slices as per 2nd position
    let hexadecimal = input.replace(/\s/g,"").match(new RegExp('.{1,2}', 'g'));

    let ascii = [];

    if (hexadecimal == null) {
        return "";
    } else {

        for (i = 0; i < hexadecimal.length; i++) {
            ascii.push(String.fromCharCode(parseInt(hexadecimal[i], 16)));
        }
    }
    return ascii.join("");
}

function decodeDecimal(input) {
    let decimal = input.split(" ");
    let ascii = [];

    for (i = 0; i < decimal.length; i++) {
        ascii.push(String.fromCharCode(parseInt(decimal[i], 10)));
    }
    return ascii.join("");
}

function decodeBase64(input) {
    try {
        atob(input); 
        document.getElementById("base64Title").innerHTML = "Base64";
    } catch (DOMException) {
        document.getElementById("base64Title").innerHTML = "Base64 <i>(Incorrectly encoded)</i>";
    }
    return atob(input);
}

function decodeURL(input) {
    return decodeURIComponent(input).replace(new RegExp("\\+", "g"), " ");
}
