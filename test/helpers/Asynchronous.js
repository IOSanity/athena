export default class Asynchronous{
    constructor(){}

    waitFor = (condition) => {
        let waitTime = 10;
        return new Promise(function (resolve) {

            let checkCondition = () => {
                let result = condition();
                if (result) {
                    resolve();
                } else {
                    waitTime = Math.min(waitTime * 1.5, 1000);
                    scheduleNextTry();
                }
            };

            let scheduleNextTry = () => setTimeout(checkCondition, waitTime);

            checkCondition();
        });
    };
}