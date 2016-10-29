import request from '../request';

let baseURL = "";

export let findAllBooks = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({method: "GET", url: baseURL + "/books" + qs})
        .then(data => data = JSON.parse(data));
}

export let findBookById = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(values[key]);
        });
    }
    return request({method: "GET", url: baseURL + "/books/" + qs})
        .then(data => data = JSON.parse(data));
}

export let findAllBookTitles = () => {
    return request({method: "POST", url: baseURL + "/booktitles"})
        .then(data => data = JSON.parse(data));
}

export let findAllStudents = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/allstudents", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let findStudentById = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/student", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let findStudentHistoryById = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/studenthistory", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let checkOutBook = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/checkout", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let checkInBook = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/checkin", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
}

export let findStudentsByBook = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/checkedout", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let findStudentsByAllBooks = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/checkedoutbooks", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let signIn = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/signin", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let signOut = () => {
    return request({method: "POST", url: baseURL + "/signout"})
        .then(data => data = JSON.parse(data));
}

export let isSignedIn = () => {
    return request({method: "POST", url: baseURL + "/signed"})
        .then(data => data = JSON.parse(data));
}

export let register = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/register", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let changePassword = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/changepassword", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let addBook = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/addbook", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let updateBook = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/updatebook", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
}

export let addStudent = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/addstudent", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let updateStudent = (values) => {
    
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/updatestudent", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
}
