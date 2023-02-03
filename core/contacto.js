let snackBarActive = false;
let portioSnackBarWrapper;
let portioSnackBar;
let portioStatusText;
let lastTimeout = null;
// Function to add  elements to original HTML content
function addElements() {
    document.body.innerHTML += `
      <div class="portio-snackbar-wrapper">
          <div class="portio-snackbar portio-failed">
              <div></div>
              <p id="portio-status-text">Portio Loading !</p>
          </div>
      </div>`;

    document.head.innerHTML += `
      <style>
          .portio-snackbar-wrapper{
              display: none;
              border-radius: 8px;
              background-color: rgba(0, 0, 0, 1);
              padding: 15px;
              font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
              color: white;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              position: fixed;
              top: 110vh; left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0;
              transition: top .5s ease-in-out, opacity .7s ease-in-out;
          }
          
          .portio-snackbar{
              display: flex;
              justify-content: space-evenly;
              align-items: center;
          }
          
          .portio-snackbar > div{
              width: 20px;
              height: 20px;
              margin-right: 10px;
              background-size : contain;
              background-repeat: no-repeat;
          }
          .portio-loading > div {
              border: .2em solid transparent;
              border-top-color: currentcolor;
              border-radius: 50%;
              animation: 1s portio-loading-loader linear infinite;
              position: relative;
              &:before {
                  content: '';
                  display: block;
                  width: inherit;
                  height: inherit;
                  position: absolute;
                  top: -.2em;
                  ;
                  left: -.2em;
                  ;
                  border: .2em solid currentcolor;
                  border-radius: 50%;
                  opacity: .5;
              }
          }
          
          @keyframes portio-loading-loader {
              0% {
                  transform: rotate(0deg);
              }
              100% {
                  transform: rotate(360deg);
              }
          }
            
          .portio-success > div{
              background-image : url("data:image/png;base64,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");
          }
          .portio-failed > div{
              background-image : url("data:image/png;base64,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");
          }
          
          .portio-snackbar > p{
              padding: 0; margin: 0;
          }
      </style>
      `;
}

// Show Snackbar
function showSnackbarWithPromise(type, text) {
    return new Promise((resolve, reject) => {
        if (type == 0) {
            portioSnackBar.classList.remove("portio-success");
            portioSnackBar.classList.remove("portio-loading");
            portioSnackBar.classList.add("portio-failed");
        } else if (type == 1) {
            portioSnackBar.classList.remove("portio-failed");
            portioSnackBar.classList.remove("portio-loading");
            portioSnackBar.classList.add("portio-success");
        } else if (type == 2) {
            portioSnackBar.classList.remove("portio-failed");
            portioSnackBar.classList.remove("portio-success");
            portioSnackBar.classList.add("portio-loading");
        }
        portioStatusText.innerHTML = text;
        portioSnackBarWrapper.style.display = "inline-block";

        setTimeout(() => {
            portioSnackBarWrapper.style.opacity = 1;
            portioSnackBarWrapper.style.top = "90vh";
            resolve();
        }, 10);
    });
}

// Hide Snackbar
function hideSnackbarWihPromise() {
    return new Promise((resolve, reject) => {
        portioSnackBarWrapper.style.opacity = 0;
        portioSnackBarWrapper.style.top = "110vh";

        setTimeout(() => {
            portioSnackBarWrapper.style.display = "none";
            resolve();
        }, 500);
    });
}


function toggleSnackbar(type, text) {
    if (snackBarActive) {
        hideSnackbarWihPromise().then(() => {
            snackBarActive = false;
            if(lastTimeout != null){
                clearTimeout(lastTimeout);
            }
        });
    }
    snackBarActive = true;
    showSnackbarWithPromise(type, text).then(
        lastTimeout = setTimeout(() => {
            hideSnackbarWihPromise().then(() => {
                snackBarActive = false;
            });
        }, 3000)
    );
}
function submitForm(e) {
    e.preventDefault();
    toggleSnackbar(2, "Sending Message");
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    const domain = document.location.host;
    const data = {
        name: name,
        mail: email,
        message: message
    }
    const final_data = {
        "domain": domain,
        "mail": data
    }
    fetch("https://helper.portio.in/contactusubmit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(final_data)
    }).then(res => res.json())
        .then(response => {
            if (response.success == true) {
                toggleSnackbar(1, "Message Sent");
            }
            else {
                toggleSnackbar(0, "Something went wrong");
            }
        }).catch(error => {
            toggleSnackbar(0, "Something went wrong");
        })
}

function addListeners() {
    // All form started with id as portio-form-*
    var forms = document.querySelectorAll('form[id^="portio-form-"]');
    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', submitForm);
    }
}

function initPlugin() {
    addElements();
    portioSnackBarWrapper = document.querySelector(
      ".portio-snackbar-wrapper"
    );
    portioSnackBar = document.querySelector(".portio-snackbar");
    portioStatusText = document.querySelector("#portio-status-text");
    addListeners();
  }

document.addEventListener('DOMContentLoaded', initPlugin);

