
function CacheStorage(key) {
    this.cacheKey = key
    this.getValueFromStorage = function() {
        const record = localStorage.getItem(this.cacheKey)
        return record
    }
    this.setValueToStorage = function(payload) {
        let existingRecord = this.getValueFromStorage()
        const record = existingRecord ? JSON.parse(existingRecord) : {};
        const newRecord = {
            ...record,
            ...payload
        }

        localStorage.setItem(this.cacheKey, JSON.stringify(newRecord))

        return newRecord
    }
}

/**
 * setCheckedValueOfRadioButtonGroup
 * @param {html input type=radio} vRadioObj 
 * @param {the radiobutton with this value will be checked} vValue 
 */
setCheckedValueOfRadioButtonGroup = (vRadio, vValue) => {
    var radios = document.getElementsByName(vRadio);
    for (var j = 0; j < radios.length; j++) {
        if (radios[j].value == vValue) {
            radios[j].checked = true;
            break;
        }
    }
}

/**
 * Method to generate random int
 */
genRandomInt = () => {
    return Math.floor(Math.random() * 1000000)
}

/**
 * Method to return human readable time
 * Set to 12h or 24h based on user's saved settings
 */
humanReadableTime = (date) => {
    const newDate = date ? new Date(date) : new Date()
    let settings = cacheStorage.getValueFromStorage()
    settings = settings ? JSON.parse(settings) : {}

    if(settings.clockDisplay == "12") {
        return newDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric" }) // 12h
    }

    return newDate.toLocaleString("en-GB", { hour: "numeric", minute: "numeric" }) // 24h
}

/**
 * Util to control settings dropdown menu
 */
const dropdownToggle = document.querySelector(".dropdown_toggle");
const dropdownToggleIcon = document.querySelector(".dropdown_toggle_icon");
dropdownToggle.addEventListener("click", function() {
    const dropdownMenuId = this.dataset.toggle;
    document.getElementById(dropdownMenuId).classList.toggle("visible");
});

// Remove visible class on dropdown menu on click out
document.addEventListener("click", e => {
    if (e.target != dropdownToggle && e.target !== dropdownToggleIcon) {
        document.getElementById("dropdownHeader").classList.remove("visible");
    }
});