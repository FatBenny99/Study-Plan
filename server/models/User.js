function User(id, email, name, hash, salt,studyplan) {
   this.id = id;
   this.email = email;
   this.name = name;
   this.hash = hash;
   this.salt = salt;
   this.studyplan=studyplan
}

module.exports = User;