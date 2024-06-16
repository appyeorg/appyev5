//Add event for pressing alt+c
document.addEventListener('keydown', function(event) {
    if (event.altKey && event.key === 'c') {
        console.log('Alt+C was pressed');
        let userInput = prompt('Enter the command:');
        if(userInput in window.appIndex){
            openApp(userInput);
        } else {
            eval(userInput);
        }
    }
});