const START_TYPE = "START_TYPE";
const FINISHED_TYPE = "FINISHED_TYPE";
const PROGRESS_TYPE = "PROGRESS_TYPE";
const START_ID = 999;
const FINISH_ID = 1000;
// generate a rand int. used to decide the time each event takes as well as which event will fail
const getRndInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createEvent = (pubsub, stream, id, type, status, ttl = 1) => {
    if (type === START_TYPE) {
        content = "This is the start event.";
    }
    if (type === PROGRESS_TYPE) {
        content = "This is a progress event.";
    }
    if (type === FINISHED_TYPE) {
        content = "This is the finished event";
    }
    const prob = Math.random();
    if (prob <= 0.33) {
        status = "success";
    }
    if (prob > 0.33 && prob <= 0.66) {
        status = "warning";
    }
    if (prob > 0.66) {
        status = "danger";
    }
    if (type === START_TYPE || type === FINISHED_TYPE) {
        status = "info";
    }
    pubsub.publish(stream, {
        eventCreated: {
            id: id,
            content: content,
            type: type,
            time: ttl,
            status: status
        }
    });
};

module.exports.runProcess = (pubsub, stream) => {
    createEvent(pubsub, stream, START_ID, START_TYPE, "success");
    console.log("start event!");

    const doEvent = n => {
        const ttl = getRndInteger(1, 3);

        if (n > 0) {
            setTimeout(function() {
                createEvent(pubsub, stream, n, PROGRESS_TYPE, "success", ttl);
                doEvent(n - 1);
            }, ttl * 1000);
        } else {
            createEvent(pubsub, stream, FINISH_ID, FINISHED_TYPE, "success");
            console.log("end event!");
        }
    };

    doEvent(20);
};
