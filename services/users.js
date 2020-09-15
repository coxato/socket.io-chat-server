// fake a database
const users = [];

const addUser = ({id, name, room}) => {
    const userName = name.trim().toLowerCase();
    const roomName = room.trim().toLowerCase();
 
    const existingUser = users.find( user => user.name === userName );
    if(existingUser){
        return { error: 'username is taken' };
    }

    const user = { id, name: userName, room: roomName};
    console.log("el user creado", user);
    users.push(user);
    return { 
        error: null,
        user
    };
}

const removeUser = (id) => {
    const index = users.findIndex( user => user.id === id );
    if(index != -1){
        users.splice(index, 1);
    }
} 

const getUser = id => users.find( user => user.id === id);

const getUsersInRoom = (room) => users.filter( user => user.room === room );

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}