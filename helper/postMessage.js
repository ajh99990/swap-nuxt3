export const postMessageApp = (methodName, options) => {
    if (window.webkit && window.webkit.messageHandlers[methodName]) {
        window.webkit.messageHandlers[methodName].postMessage(options)
    } else {
        if (window[methodName]) {
            // android 的 undefined 也不行
            if (options) {
                window[methodName].postMessage(options)
            } else {
                window[methodName].postMessage()
            }
            
        } else {
            console.log('no inject function');
        }

    }
}

let methodId = 1
export const postMessageAppCallback = (methodName, options) => {
    return new Promise((resolve, reject) => {
        const callbackFunctionName = 'methodName' + (methodId++)
        window[callbackFunctionName] = (callbackData) => {
            resolve(callbackData)
        }
        if (window.webkit) {
            window.webkit.messageHandlers[methodName].postMessage(JSON.stringify({ options, callbackFunctionName }))
        } else {
            if (window[methodName]) {
                window[methodName].postMessage(JSON.stringify({ options, callbackFunctionName }))
            } else {
                console.log('no inject function');
            }

        }
    })
}

export const judgePlatform = (methodName) => {
    // ios
    if (window.webkit && window.webkit.messageHandlers[methodName]) return true
    //android
    if (window[methodName] && window[methodName].postMessage) return true

    return false
}