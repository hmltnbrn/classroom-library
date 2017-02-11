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
    return request({method: "GET", url: baseURL + "/books/titles"})
        .then(data => data = JSON.parse(data));
}

export let findAllStudents = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/students", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
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
    return request({method: "POST", url: baseURL + "/student/history", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let checkOutBook = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/book/checkout", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let checkInBook = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/book/checkin", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
}

export let findStudentsByBook = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/checkedout/book/students", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let findStudentsByAllBooks = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/checkedout/books/students", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let signIn = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/user/signin", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let signOut = () => {
    return request({method: "POST", url: baseURL + "/user/signout"})
        .then(data => data = JSON.parse(data));
}

export let isSignedIn = () => {
    return request({method: "POST", url: baseURL + "/user/session"})
        .then(data => data = JSON.parse(data));
}

export let register = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/user/register", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let changePassword = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/user/changepassword", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let addBook = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/book/add", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let updateBook = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/book/update", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
}

export let addStudent = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/student/add", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
        .then(data => data = JSON.parse(data));
}

export let updateStudent = (values) => {

    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
    }
    return request({method: "POST", url: baseURL + "/student/update", data: qs, headers: {"Content-type":"application/x-www-form-urlencoded"}})
}
