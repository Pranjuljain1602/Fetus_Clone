var store_id = getParameterByName('store');
var shop_url = getParameterByName('shop');
// alert('Shop URL: '+shop_url+' -- Store ID: '+store_id);

// $
// .post('https://gstapp.lpanache.com/shipping_bar/dashboard/get_my_bars', {store_id: store_id, shop_url: shop_url})
// .success(function(data, status, header, config){
// console.log(data);
// })
// .error(function(data, status, header, config){
// console.log('service call error ' + data);
// });

(function () {
    var pageURL = window.location.href;

    if (pageURL.indexOf('/thank_you') > -1 || pageURL.indexOf('/orders/') > -1 || pageURL.indexOf('/cart') > -1) {
        console.log('cart gst : ' + pageURL);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == true) {
                    var gst_path = window.location.pathname;

                    gst_path = gst_path.split('/');

                    var customer_company_name = localStorage.getItem('customer_company_name');
                    var customer_gst_number = localStorage.getItem('customer_gst_number');

                    if (customer_company_name == null) {
                        customer_company_name = '';
                    }
                    if (customer_gst_number == null) {
                        customer_gst_number = '';
                    }

                    if (gst_path.includes('cart')) {
                        /**** CART PAGE CODE STARTS ****/

                        var btn = document.createElement("a");
                        btn.href = "javascript:toggleGstDetails()";
                        btn.style = "margin-left: 10px;line-height: 1.2;margin-bottom: 10px;";
                        btn.classList.add("btn");
                        btn.innerHTML = "GSTIN Details";
                        if( document.querySelector('#checkout'))
                         document.querySelector('#checkout').insertAdjacentElement("afterend", btn);
                        else
                         document.querySelectorAll('[name="checkout"]').forEach((el) => {
                             el.insertAdjacentElement("afterend", btn); 
                         })  
                        var row = '<style>.gst-custom-fields p input{width:100%;border:1px solid;}.gst-custom-fields p{width:50%; padding:20px 5px; float:left; border-top:1px solid;border-bottom:1px solid} .gst-hide{display:none}</style><div class="gst-custom-fields gst-hide"><p><label for="customer_company_name"> Name on GSTIN: </label><input onblur="setCompanyName(this.value)" id="customer_company_name"  type="text" name="attributes[customer_company_name]" maxlength="50" value="' + customer_company_name + '"></p><p><label for="customer_gst_number"> GSTIN Number: </label><input onblur="setCompanyGST(this.value)" id="customer_gst_number" onkeyup="checkGST(this.value)" type="text" name="attributes[customer_gst_number]" value="' + customer_gst_number + '"><small id="gst_number_error" style="color:red"></small></p></div>';
                        
                        if( document.querySelector('#checkout'))
                         document.querySelector('#checkout').parentElement.insertAdjacentHTML('afterend', row);
                        else
                         document.querySelectorAll('[name="checkout"]').forEach((el) => {
                             el.parentElement.insertAdjacentHTML("afterend", row); 
                         }) 


                        /**** CART PAGE CODE ENDS ****/
                    }

                    if ((gst_path.includes('orders')) || (gst_path.includes('thank_you'))) {
                        /**** THANK YOU PAGE CODE STARTS ****/

                        var order_number = document.querySelector('.os-order-number').innerHTML.trim().split('#')[1];

                        var row = '<style>.update-gst-p{padding-right: 10px;padding-bottom: 10px;text-align: right;} .update-gst-btn {line-height: 1.2;padding: 10px;}.gst-custom-fields{display: flex;padding: 5px;} .gst-custom-fields p input{width: 95%;border: 1px solid #ccc;border-radius: 2px;padding: 5px;}.gst-custom-fields p{width:50%; padding:20px 5px; float:left; border-top:1px solid;}</style><div class="gst-custom-fields"><p><label for="customer_company_name"> Name on GSTIN: </label><input onblur="setCompanyName(this.value)" id="customer_company_name"  type="text" name="attributes[customer_company_name]" maxlength="50" value="' + customer_company_name + '"></p><p><label for="customer_gst_number"> GSTIN Number: </label><input onblur="setCompanyGST(this.value)" id="customer_gst_number" onkeyup="checkGSTThanks(this.value)"  type="text" name="attributes[customer_gst_number]" value="' + customer_gst_number + '"><small id="gst_number_error" style="color:red"></small></p></div><p class="update-gst-p"><span id="succ" style="color:green;display:none;"></span><span id="fail" style="color:red;display:none;"></span><a id="update-gst-btn" class="update-gst-btn btn" href="javascript:updateGSTIN(' + store_id + ',' + order_number + ')" >Update GSTIN</a></p>';

                        var step_attr = document.getElementsByClassName('step')[0].getAttribute("data-step");

                        if (step_attr == 'thank_you') {
                            document.querySelector('.content-box:nth-child(2)').insertAdjacentHTML('beforeend', row);
                        }

                        /**** THANK YOU PAGE CODE ENDS ****/
                    }
                }
            }
        }
        xhttp.open("POST", "https://indiagstapp.com/webhook/checkIntegrationEnabled", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send('store_id=' + store_id);
    }
})();


function checkGST(gst_number) {
    if (!gst_checksum(gst_number)) {
        document.getElementById('gst_number_error').innerHTML = '*Enter valid GST Number.';
    } else {
        document.getElementById('gst_number_error').innerHTML = '';
    }
}

function checkGSTThanks(gst_number) {
    if (!gst_checksum(gst_number)) {
        document.getElementById('gst_number_error').innerHTML = '*Enter valid GST Number.';
        document.getElementById('update-gst-btn').style = "cursor: not-allowed;pointer-events:none";
    } else {
        document.getElementById('gst_number_error').innerHTML = '';
        document.getElementById('update-gst-btn').style = "cursor:pointer;pointer-events:all";
    }
}

function updateGSTIN(store, order_number) {
    var customer_company_name = document.getElementById('customer_company_name').value;
    var customer_gst_number = document.getElementById('customer_gst_number').value;
    var error = false;

    if (customer_company_name == '') {
        document.getElementById('customer_company_name').style = 'border:1px solid red';
        error = true;
    } else {
        document.getElementById('customer_company_name').style = 'border:1px solid #ccc';
    }

    if (customer_gst_number == '') {
        document.getElementById('customer_gst_number').style = 'border:1px solid red';
        error = true;
    } else {
        if (!gst_checksum(customer_gst_number)) {
            document.getElementById('gst_number_error').innerHTML = '*Enter valid GST Number.';
        } else {
            document.getElementById('gst_number_error').innerHTML = '';
            document.getElementById('customer_gst_number').style = 'border:1px solid #ccc';
        }
    }

    if (error == false) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == true) {
                    document.getElementById('fail').style = 'display:none;color: red;';
                    document.getElementById('fail').innerHTML = '';
                    document.getElementById('succ').style = 'display:block;color: green;';
                    document.getElementById('succ').innerHTML = 'Updated.';
                } else {
                    document.getElementById('succ').style = 'display:none;color: green;';
                    document.getElementById('succ').innerHTML = '';
                    document.getElementById('fail').style = 'display:block;color: red;';
                    document.getElementById('fail').innerHTML = 'Failed.';
                }
            }
            setTimeout(function () {
                document.getElementById('succ').style = 'display:none;';
                document.getElementById('fail').style = 'display:none;';
                document.getElementById('succ').innerHTML = '';
                document.getElementById('fail').innerHTML = '';
            }, 3000);
        }
        xhttp.open("POST", "https://indiagstapp.com/webhook/updateGstDetailsinOrder", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send('store_id=' + store + '&order_number=' + order_number + '&customer_gst_number=' + customer_gst_number + '&customer_company_name=' + customer_company_name);
    }
}

function checkIntegrationEnabled(store_id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    xhttp.open("POST", "https://indiagstapp.com/webhook/checkIntegrationEnabled", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('store_id=' + store_id);
}

function toggleGstDetails() { 
    document.querySelectorAll(".gst-custom-fields").forEach((el) => {
       el.classList.toggle("gst-hide"); 
    })
       
}

function setCompanyName(g_value) {
    var type = localStorage.getItem('customer_company_name');
    if (type) {
        localStorage.customer_company_name = g_value;
    } else {
        localStorage.setItem('customer_company_name', g_value);
    }
}
function setCompanyGST(g_value) {
    if (!gst_checksum(g_value)) {
        document.getElementById('gst_number_error').innerHTML = '*Enter valid GST Number.';
    } else {
        document.getElementById('gst_number_error').innerHTML = '';
        var type = localStorage.getItem('customer_gst_number');
        if (type) {
            localStorage.customer_gst_number = g_value;
        } else {
            localStorage.setItem('customer_gst_number', g_value);
        }
    }
}

function gst_checksum(g) {
    let regTest = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g)
    if (regTest) {
        let a = 65, b = 55, c = 36;
        return Array['from'](g).reduce((i, j, k, g) => {
            p = (p = (j.charCodeAt(0) < a ? parseInt(j) : j.charCodeAt(0) - b) * (k % 2 + 1)) > c ? 1 + (p - c) : p;
            return k < 14 ? i + p : j == ((c = (c - (i % c))) < 10 ? c : String.fromCharCode(c + b));
        }, 0);
    }
    return regTest
}

function getParameterByName(name, url = document.currentScript.src) {
    name = name.replace(/[\[\]]/g, '\\$&');

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
