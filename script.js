// Select DOM elements
const calendar = document.querySelector(".calendar"),
 date = document.querySelector(".date"),
 daysContainer = document.querySelector(".days"),
 prev = document.querySelector(".prev"),
 next = document.querySelector(".next"),
 todayBtn = document.querySelector(".today-btn"),
 gotoBtn = document.querySelector(".goto-btn"),
 dateInput = document.querySelector(".date-input"),
 eventDay = document.querySelector(".event-day"),
 eventDate = document.querySelector(".event-date"),
 eventsContainer = document.querySelector(".events"),
 addEventSubmit = document.querySelector(".add-event-btn");
 

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

//set a empty array
let eventsArr = [];

//then call get
getEvents();

function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 6 - lastDay.getDay();

    date.innerHTML = `${months[month]} ${year}`;

    let days = "";

    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
                event = true;
            }
        });
    
        let dayClass = "day";
        if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
            dayClass += " today";
        }
        if (event) {
            dayClass += "  event"; // Adds the event class
        }
        if (i === activeDay && month === activeMonth && year === activeYear) {
            dayClass += " active";
        }
    
        days += `<div class="${dayClass}">${i}</div>`;
    }
    

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    daysContainer.innerHTML = days;
    
    // Call getActiveDay and updateEvents for the currently selected day
    getActiveDay(activeDay || today.getDate());
    updateEvents(activeDay || today.getDate());

    addListener();
}



initCalendar();

// Previous month
function prevMonth() {
    // Add fade-out-left class to animate removal of current days
    daysContainer.classList.add("fade-out-right");

    setTimeout(() => {
        month--;
        if (month < 0) {
            month = 11;
            year--;
        }
        initCalendar();

        // Remove fade-out-left and add fade-in-left class for new month
        daysContainer.classList.remove("fade-out-right");
        daysContainer.classList.add("fade-in-right");

        // Remove fade-in-left class after animation completes
        setTimeout(() => daysContainer.classList.remove("fade-in-right"), 300);
    }, 300); // 300ms matches the duration of fade-out-left animation
}

// Next month
function nextMonth() {
    // Add fade-out-right class to animate removal of current days
    daysContainer.classList.add("fade-out-left");

    setTimeout(() => {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
        initCalendar();

        // Remove fade-out-right and add fade-in-right class for new month
        daysContainer.classList.remove("fade-out-left");
        daysContainer.classList.add("fade-in-left");

        // Remove fade-in-right class after animation completes
        setTimeout(() => daysContainer.classList.remove("fade-in-left"), 300);
    }, 300); // 300ms matches the duration of fade-out-right animation
}



// Event listeners
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Logic for handling "Today" button click
todayBtn.addEventListener("click", () => {
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let fadeOutClass = "";
    let fadeInClass = "";

    // Compare current month/year with the calendar's month/year to determine fade direction
    if ((month < currentMonth && year === currentYear) || (year < currentYear)) {
        // If the current month/year is in the future
        fadeOutClass = "fade-out-left";  // Fade out to the left (because we're going to the past)
        fadeInClass = "fade-in-left";    // Fade in from the left (going back to today's month)
    } else if ((month > currentMonth && year === currentYear) || (month === currentMonth && year > currentYear)) {
        // If the current month/year is in the past
        fadeOutClass = "fade-out-right"; // Fade out to the right (because we're going to the future)
        fadeInClass = "fade-in-right";   // Fade in from the right (going forward to today's month)
    } else {
        // If we're already on today's month (no need for any fade)
        fadeOutClass = "fade-out-right"; // Just fade out to the right
        fadeInClass = "fade-in-right";   // And fade back in from the right
    }

    // Add fade-out class to animate removal of current days
    daysContainer.classList.add(fadeOutClass);

    // After 300ms (animation duration), reinitialize the calendar and apply the fade-in effect
    setTimeout(() => {
        // Reset the month/year to today's date
        month = currentMonth;
        year = currentYear;

        // Reinitialize the calendar with today's date
        initCalendar();

        // Remove fade-out and add fade-in class if necessary
        if (fadeOutClass) {
            daysContainer.classList.remove(fadeOutClass);
            daysContainer.classList.add(fadeInClass);
        }

        // Remove fade-in class after the animation completes
        if (fadeInClass) {
            setTimeout(() => daysContainer.classList.remove(fadeInClass), 300);
        }
    }, 300); // Match the fade-out animation duration
});


// Updated gotoDate function with fade animations based on direction
function gotoDate() {
    const dateValue = dateInput.value.trim();

    // Check if the input matches the format MM/YYYY
    const datePattern = /^\d{2}\/\d{4}$/;
    if (!datePattern.test(dateValue)) {
        alert("Invalid date format. Please enter as MM/YYYY.");
        return;
    }

    const dateArr = dateValue.split("/");
    const enteredMonth = parseInt(dateArr[0], 10);
    const enteredYear = parseInt(dateArr[1], 10);

    // Validate the month and year values
    if (enteredMonth >= 1 && enteredMonth <= 12 && dateArr[1].length === 4) {
        let fadeOutClass = "";
        let fadeInClass = "";

        // Determine if the entered date is in the past or future relative to the current calendar date
        if (enteredYear < year || (enteredYear === year && enteredMonth - 1 < month)) {
            fadeOutClass = "fade-out-right"; // Fade out to the right if going to a past date
            fadeInClass = "fade-in-right";
        } else if (enteredYear > year || (enteredYear === year && enteredMonth - 1 > month)) {
            fadeOutClass = "fade-out-left";  // Fade out to the left if going to a future date
            fadeInClass = "fade-in-left";
        }

        // Add the fade-out class
        daysContainer.classList.add(fadeOutClass);

        setTimeout(() => {
            // Update month and year
            month = enteredMonth - 1; // Convert to zero-based month index
            year = enteredYear;

            // Reinitialize the calendar
            initCalendar();

            // Remove the fade-out class and add the fade-in class
            daysContainer.classList.remove(fadeOutClass);
            daysContainer.classList.add(fadeInClass);

            // Remove fade-in class after animation completes
            setTimeout(() => daysContainer.classList.remove(fadeInClass), 300);
        }, 300); // 300ms matches the fade-out animation duration
    } else {
        alert("Invalid date format. Please enter as MM/YYYY.");
    }
}


// Goto date button event listener
gotoBtn.addEventListener("click", gotoDate);

// input formatting with validation
dateInput.addEventListener("input", () => {
    // Automatically insert slash when the input length is 2 (for MM/YYYY format)
    if (dateInput.value.length === 2 && !dateInput.value.includes("/")) {
        dateInput.value += "/";
    }
});

const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    // if click outside
    if (!addEventContainer.contains(e.target) && e.target !== addEventBtn) {
        addEventContainer.classList.remove("active");
    }
});

//allow only 50 chars in title

addEventTitle.addEventListener("input", (e) => {
    if (addEventTitle.value.length > 50) {
        addEventTitle.value = addEventTitle.value.slice(0, 50);
    }
});

//time format in from and to time

addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    //if two numbers entered auto add 
    if(addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    // dont let user enter more than 5 chars
    if(addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});

//to time

addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    //if two numbers entered auto add 
    if(addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    // dont let user enter more than 5 chars
    if(addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});

//function to add listern on days after rendering

function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);
            activeMonth = month;
            activeYear = year;

            days.forEach((day) => {
                day.classList.remove("active");
            });

            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    document.querySelector(`.day:not(.prev-date):contains(${activeDay})`).classList.add("active");
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    document.querySelector(`.day:not(.next-date):contains(${activeDay})`).classList.add("active");
                }, 100);
            } else {
                e.target.classList.add("active");
            }
            
            // Update active day display
            getActiveDay(activeDay);
            updateEvents(activeDay);
        });
    });
}



// show active day events and date at top


function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function to show events of that day
function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        // Get events of the active day only
        if (date === event.day && month + 1 === event.month && year === event.year) {
            event.events.forEach((e) => {
                events += `<div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${e.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${e.time}</span>
                    </div>
                </div>`;
            });
        }
    });
    // If no events
    if (events === "") {
        events = `<div class="no-event">No Events</div>`;
    }

    eventsContainer.innerHTML = events;
    //save events when update event called
    saveEvents();
}

// function to add events
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    // Validate the input fields
    if (eventTitle ==="" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill out all fields.");
        return;
    }
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (timeFromArr.length !== 2 || timeToArr.length !== 2 || timeFromArr[0] > 23 || timeFromArr[1] > 59 || timeToArr[0] > 23 || timeToArr[1] > 59) {
        alert("Invalid time format. Please enter as HH:MM.");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title : eventTitle,
        time: timeFrom + " - " + timeTo,
    };

    let eventAdded = false;

    // check if eventsArr not empty
    if(eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (activeDay === item.day && month + 1 === item.month && year === item.year) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    //if event array empty or no event created new
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }
    // remove active from add event form
    addEventContainer.classList.remove("active");
    //clear the fields
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";

    // show current added event

    updateEvents(activeDay);

    //also add event class to newly added day if not already
    const activeDayElem = document.querySelector(".day.active");
    if (!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }
});

function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = parseInt(timeArr[0], 10);
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = `${timeHour}:${timeMin} ${timeFormat}`;
    return time;
}



eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;
        //get the title of event than search in array by title and delete
        eventsArr.forEach((event) => {
            if(event.day === activeDay && event.month === month + 1 && event.year === year) {
                event.events.forEach((item,index) => {
                    if(item.title === eventTitle) {
                        event.events.splice(index, 1);
                    }
                });
                //if no event remaining on that day remove complete day
                if(event.events.length === 0) {
                    eventsArr.splice(eventsArr.indexOf(event), 1);
                    //after remove complete day also remove active class of that day
                    const activeDayElem = document.querySelector(".day.active");
                    if (activeDayElem.classList.contains("event")) {
                        activeDayElem.classList.remove("event");
                    }
                }
            }
        });
        updateEvents(activeDay);
    }
});


function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
    if (localStorage.getItem("events" === null)) {
        return;
    }
        eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}