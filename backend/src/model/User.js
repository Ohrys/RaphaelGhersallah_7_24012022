/*export */ class User {
    constructor(id, name, urlAvatar=null, password, email, isModerator=false) {
        this.id = id;
        this.name = name;
        this.urlAvatar = urlAvatar;
        this.password = password;
        this.email = email;
        this.isModerator = isModerator;
    }
}

module.exports = {
    User: User
};