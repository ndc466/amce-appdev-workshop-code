import jsan from 'jsan';

export default class StateLoader {

  loadState() {
    try {
      let serializedState = localStorage.getItem("persist:auth");
      console.log(serializedState)

      if (serializedState === null) {
        return this.initializeState();
      }

      return jsan.parse(serializedState);
    }
    catch (err) {
      return this.initializeState();
    }
  }

  saveState(state) {
    try {
      let serializedState = jsan.stringify(state);
      localStorage.setItem("persist:auth", serializedState);
    }
    catch (err) {
    }
  }

  initializeState() {
    return {
      //state object
    };
  }
};
