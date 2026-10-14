let current = '0';
let previous = '';
let operator = null;

const small = document.getElementById('small');
const big = document.getElementById('big');

// update the screen
function update() {
    big.textContent = current;
    if (operator) {
        small.textContent = previous + ' ' + showOp(operator);
    } else {
        small.textContent = '';
    }
}

function showOp(op) {
    if (op === '/') return '÷';
    if (op === '*') return '×';
    return op;
}

// number buttons
document.querySelectorAll('[data-num]').forEach(function(btn) {
    btn.onclick = function() {
        let num = btn.dataset.num;

        // handle decimal
        if (num === '.' && current.includes('.')) return;

        // first number or fresh start
        if (current === '0' && num !== '.') {
            current = num;
        } else {
            current = current + num;
        }

        update();
    };
});

document.querySelectorAll('[data-op]').forEach(function(btn) {
    btn.onclick = function() {
        if (current === '' || current === 'Error') return;

        // if we already have a previous + operator, calculate first
        if (previous !== '' && operator) {
            calculate();
        }

        operator = btn.dataset.op;
        previous = current;
        current = '';
        update();
    };
});

function calculate() {
    let a = parseFloat(previous);
    let b = parseFloat(current);
    let result;

    if (isNaN(a) || isNaN(b)) return;

    if (operator === '+') result = a + b;
    else if (operator === '-') result = a - b;
    else if (operator === '*') result = a * b;
    else if (operator === '/') {
        if (b === 0) {
            current = 'Error';
            previous = '';
            operator = null;
            update();
            return;
        }
        result = a / b;
    }

   
    result = Math.round(result * 100000000) / 100000000;

    current = result.toString();
    previous = '';
    operator = null;
}


document.querySelector('[data-act="equal"]').onclick = function() {
    if (operator && previous !== '') {
        calculate();
        update();
    }
};

document.querySelector('[data-act="clear"]').onclick = function() {
    current = '0';
    previous = '';
    operator = null;
    update();
};

document.querySelector('[data-act="del"]').onclick = function() {
    if (current === '0' || current === 'Error') return;

    current = current.slice(0, -1);
    if (current === '') current = '0';
    update();
};

document.querySelector('[data-act="percent"]').onclick = function() {
    let num = parseFloat(current);
    if (isNaN(num)) return;

    current = (num / 100).toString();
    update();
};

document.addEventListener('keydown', function(e) {
    let key = e.key;

    if (key >= '0' && key <= '9') {
        document.querySelector('[data-num="' + key + '"]').click();
    } else if (key === '.') {
        document.querySelector('[data-num="."]').click();
    } else if (key === '+') {
        document.querySelector('[data-op="+"]').click();
    } else if (key === '-') {
        document.querySelector('[data-op="-"]').click();
    } else if (key === '*') {
        document.querySelector('[data-op="*"]').click();
    } else if (key === '/') {
        e.preventDefault();
        document.querySelector('[data-op="/"]').click();
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        document.querySelector('[data-act="equal"]').click();
    } else if (key === 'Backspace') {
        document.querySelector('[data-act="del"]').click();
    } else if (key === 'Escape') {
        document.querySelector('[data-act="clear"]').click();
    }
});

update();