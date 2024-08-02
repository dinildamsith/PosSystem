
import {PlaceOrderModel} from "../Model/PlaceOrderModel.js";





// Define total in a broader scope
// Initialize the total as a number
var total = 0;





$("#cart_btn").on('click', () => {

    var item_description = $("#item_description_select").val();
    var unit_price = parseFloat($("#unit_price").val());
    var qty = parseInt($("#qty").val());


    if (validate(item_description,'Item Description') && validate(unit_price,'Unit Price') && validate(qty,'Qty')){
        var newRow = "<tr><th scope='row'>" + item_description + "</th><td>" + unit_price + "</td><td>" + qty + "</td></tr>";
        $("#cart_table").append(newRow);

    }

    // Update the total
    total += unit_price * qty;
    document.getElementById("order_total").textContent = total; // Update the content of the "order_total" element



});



var cashInput = document.getElementById("cash");// Get the input element with the id "cash"
cashInput.addEventListener("input", (event) => {// Add an input event listener to the input element
    let cash = parseFloat($("#cash").val()); // Parse the cash value as a float
    let balance = cash - total;
    // Update the content of the "balance" element
    $("#balance").val(balance);
});



$("#place_order_btn").on('click', () => {

    // Order Mange Table set Data
    var order_id = document.getElementById("orderId").textContent
    var customer_id = $("#customerOrder_Id").val();
    var order_date = document.getElementById("order_Date").textContent



    var item_description = $("#item_description_select").val();
    var unit_price = parseFloat($("#unit_price").val());
    var qty = parseInt($("#qty").val());


    var total  = unit_price*qty;

    if (validate(customer_id,'Customer Id')){
        let PlaceOrder = new PlaceOrderModel(customer_id,order_id,order_date,item_description,qty,total)

        let orderDetailsJson = JSON.stringify(PlaceOrder);

        const sendAJAX = (OrderDetailsObjectJson) => {
            const http = new XMLHttpRequest();
            http.onreadystatechange = () =>{
                //Validation
                if (http.readyState == 4 && http.status == 200) {
                    alert("Success")
                    allOrders_SetTable()
                    orderIdGenerate();
                    clear();
                }else{
                    alert("Failed")
                }
            }
            http.open("POST","http://localhost:8080/pos_back_end_war_exploded/order",true);
            http.setRequestHeader("Content-Type","application/json");
            http.send(OrderDetailsObjectJson)
        }

        sendAJAX(orderDetailsJson)

        Swal.fire(
            'Success!',
            'Order Place Successfully!',
            'success'
        )
        $("#cart_table").empty();
        clear_fields();
    }


});

function allOrders_SetTable() {
    fetch('http://localhost:8080/pos_back_end_war_exploded/order')

        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Create rows for all orders and store them in a variable
            const tableRows = data.map(orderDetails => {
                return `<tr><th scope='row'>${orderDetails.order_Id}</th><td>${orderDetails.customer_Id}</td><td>${orderDetails.date}</td></tr>`;
            });

            // Set the table content once with all rows
            $("#mange_order_table").html(tableRows.join(""));
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Current Date Set

var currentDate = new Date();
var year = currentDate.getFullYear();
var month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
var day = currentDate.getDate();

$("#order_Date").text(year + "-" + month + "-" + day + " ")


function orderIdGenerate() {
    fetch('http://localhost:8080/pos_back_end_war_exploded/order')
        .then(response => response.json())
        .then(data => {
            data.forEach(order => {
                // Extract the numeric part of the order ID
                var nowIdNumber = parseInt(order.order_Id.slice(-3)); // Extract the last 3 digits

                // Increment the numeric part
                var newIdNumber = nowIdNumber + 1;

                // Pad the new ID with leading zeros to maintain 3-digit format
                var newId = newIdNumber.toString().padStart(3, '0');

                // Update the order ID element
                $("#orderId").text(newId);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}



function clear(){
    $("#customerOrder_Id").val('');

    // Remove default values for Select Item section
    $("#item_description_select").val('');
    $("#qtyOnHand").val('');
    $("#qty").val('');
    $("#unit_price").val('');
}
function clear_fields() {
    $('#customerOrder_Id').val("");
    $('#cash').val('');
    $("#balance").val("")
}


function validate(value, field_name){
    if (!value){
        Swal.fire({
            icon: 'warning',
            title: `Please enter the ${field_name}!`
        });
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
orderIdGenerate();
allOrders_SetTable()
});











