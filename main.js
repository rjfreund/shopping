var DateTime = require('luxon').DateTime;

var _ = {};

Array.from(document.querySelectorAll('.shopping-item')).map(function(shoppingItemNode){ 
    shoppingItemNode.onkeyup = handleInputChange; 
});

var shoppingListItems = (function(){    
    _.items = [];
    _.idCount = _.items.length;
    _.eventListeners = {};
    _.add = function(inputItem){
        if (inputItem == undefined) { inputItem = {}; }
        inputItem.id = _.idCount;
        _.items.push(inputItem);
        (_.eventListeners.add) ? _.eventListeners.add.map(function(eventListener){ eventListener(); }) : null;
        (_.eventListeners.onchange) ? _.eventListeners.onchange.map(function(eventListener){ eventListener(); }) : null;
        _.idCount++;
    };
    _.remove = function(inputId){ _.items = _.items.filter(function(item){ 
        debugger;
        var isTrue = (item.id !== inputId);
        return isTrue; 
    }); };
    _.addEventListener = function(eventListenerType, eventListener){ 
        switch(eventListenerType){
            case "onchange":
            case "add":
                if (_.eventListeners[eventListenerType] == undefined){
                    _.eventListeners[eventListenerType] = [];
                }
                _.eventListeners[eventListenerType].push(eventListener);
                break;
            default: break;    
        }
    };
    _.listEventListeners = function(){
        var eventListenersString = "";
        for (var key in eventListeners){
            eventListenersString += key + "\n";
        }
        return eventListenersString;
    };
    _.getId = function(){ return _.idCount; };
    return _;
})();


function handleInputChange(event){
    console.log(event);
    switch(event.key){
        case "Enter":
            shoppingListItems.add({});
            break;
        default:
            break;
    }
}

shoppingListItems.addEventListener("onchange", function(){ addRow(); });

function addRow(){
    var table = document.querySelector('.shopping-list-table');
    var row =  table.insertRow(-1); /*inserts row at last position*/
    var checkboxCell = row.getElementsByClassName('checkbox-cell')[0] || row.insertCell(-1);
    checkboxCell.className='checkbox-cell';    
    checkboxCell.innerHTML = "☐";
    checkboxCell.onclick = function(event){
        (event.target.innerHTML === "☐") ? event.target.innerHTML = "☐" : event.target.innerHTML = "☑";
    };
    var shoppingItemCell = row.getElementsByClassName('shopping-item-cell')[0] || row.insertCell(-1);
    shoppingItemCell.id = shoppingListItems.getId();
    shoppingItemCell.className='shopping-item-cell';
    var shoppingItemInput = shoppingItemCell.getElementsByTagName('input')[0] || document.createElement('input');
    shoppingItemInput.onkeyup = handleInputChange;
    shoppingItemCell.appendChild(shoppingItemInput);
    shoppingItemInput.focus();
    var dateCreatedCell = row.getElementsByClassName('date-created-cell')[0] || row.insertCell(-1);
    dateCreatedCell.className = 'date-created-cell';
    dateCreatedCell.innerHTML = DateTime.local();
    var deleteShoppingItemCell = row.getElementsByClassName('delete-button-cell')[0] || row.insertCell(-1);
    var deleteShoppingItemButton = deleteShoppingItemCell.getElementsByTagName('button')[0] || document.createElement('button');
    deleteShoppingItemButton.innerHTML = "X";
    deleteShoppingItemButton.onclick = function(event){
        shoppingListItems.remove(parseInt(shoppingItemCell.id));
    };
    deleteShoppingItemCell.appendChild(deleteShoppingItemButton);
}

shoppingListItems.add({});