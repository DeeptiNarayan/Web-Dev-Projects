//=============BUDGET CONTROLLER ===================//

var budgetController = (function() {
  
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description,
        this.value = value;
        this.percentage = -1;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description,
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },      
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current, index, array) {
            sum += current.value
        });
        data.totals[type] = sum;
    }

    //=========public functions================//

    return {
        addItem: function(type, description, value) {
            var newItem;

            //Create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new Item based on type
            if(type === 'exp') {
                newItem = new Expense(ID, description, value)
            } else {
                newItem = new Income(ID, description, value);
            }

            //Push to data structure
            data.allItems[type].push(newItem);

            //return to controller
            return newItem;
        },

        deleteItem: function(type, id) {

            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1)
            {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {

            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the % of income that is spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        calculatePercentages: function() {

            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });

        },

        getBudget: function() {
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            };
        },

        getPercantages: function() {
            var allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },

        testing: function() {
            console.log(data);
        }
    }
})();

//=============UI CONTROLLER=========================//

var UIController = (function() {
    
    var DOMString = {
        inputType : ".add__type",
        inputDesc : ".add__description",
        inputValue : ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        datelabel: ".budget__title--month"

    }

    var formatNumber =  function(num, type) {

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    return {
        getInput: function() {
            return {
                type : document.querySelector(DOMString.inputType).value,
                description : document.querySelector(DOMString.inputDesc).value,
                value : parseFloat(document.querySelector(DOMString.inputValue).value)
            }          
        },

        getDOMString : function() {
            return DOMString;
        },

        addListItem: function(object, type) {
            var html, newHtml, element;

            // 1. create html string with placeholder text
            if(type === "inc") {
                element = DOMString.incomeContainer;
                html = "<div class=\"item clearfix\"id=\"inc-%id%\"><div class=\"item__description\">%description%</div><div class=\"right clearfix\"><div class=\"item__value\">%value%</div><div class=\"item__delete\"><button class=\"item__delete--btn\"><i class=\"ion-ios-close-outline\"></i></button></div></div></div>"
            }
            else if(type === "exp") {
                element = DOMString.expenseContainer;
                html = "<div class=\"item clearfix\"id=\"exp-%id%\"><div class=\"item__description\">%description%</div><div class=\"right clearfix\"><div class=\"item__value\">%value%</div><div class=\"item__percentage\">21%</div><div class=\"item__delete\"><button class=\"item__delete--btn\"><i class=\"ion-ios-close-outline\"></i></button></div></div></div>"
            }
            
            // 2. Replace placeholder text with actual data
            newHtml = html.replace("%id%", object.id);
            newHtml = newHtml.replace("%description%", object.description);
            newHtml = newHtml.replace("%value%", formatNumber (object.value));

            // 3. Insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var element =  document.getElementById(selectorID)
            element.parentNode.removeChild(element);
        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMString.inputDesc + ',' + DOMString.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);  //To convert output of querySelectorAll

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(object) {
            var type;
            object.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMString.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMString.incomeLabel).textContent = formatNumber(object.totalInc, 'inc');
            document.querySelector(DOMString.expenseLabel).textContent = formatNumber(object.totalExp, 'exp');
            if(object.percentage > 0) {
                document.querySelector(DOMString.percentageLabel).textContent = object.percentage + ' %';
            } else {
                document.querySelector(DOMString.percentageLabel).textContent = "---"
            }  
        },

        displayPercentages: function(percentages) {

            var field = document.querySelectorAll(DOMString.expensesPercLabel);

            for(var i = 0; i < percentages.length; i++) {
                field[i].textContent = percentages[i] + '%';
            }
        },

        displayMonth: function() {

            var now, months, month, year;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMString.datelabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {

            var fields;
            fields = document.querySelectorAll(
            DOMString.inputType + ' , ' +
            DOMString.inputValue + ' , ' +
            DOMString.inputDesc);

            fields.forEach(function(current) {
                console.log("Changed");
                current.classList.toggle('red-focus');
            }); 
        }
    };

})();

//=======================CONTROLLER==========================//

var controller = (function(bdgtCtrl, UICtrl) {
  
    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMString();

        document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        document.addEventListener("keydown", function(event) {
            if(event.keyCode === 13 || event.which === 13) {
               ctrlAddItem();
            } 
        });
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function() {

        // 1. Calculate the budget
        bdgtCtrl.calculateBudget();

        // 2. Return budget
        var budget = bdgtCtrl.getBudget();

        // 3. Add budget to UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // 1. Calculate percentages
        bdgtCtrl.calculatePercentages();

        // 2. Return from budget controller
        var percentages = bdgtCtrl.getPercantages();
        console.log(percentages);

        // 3. Add % to UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get field input value
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to budget controller
            newItem = bdgtCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fiels
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {

            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            console.log(type, ID);
            // 1. Delete item from data strcture
            bdgtCtrl.deleteItem(type, ID);

            // 2. Delete item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();

        }
    };

    //=========public functions================//

    return {
        init: function() {
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
            UICtrl.displayMonth();
            console.log("App has started");
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();