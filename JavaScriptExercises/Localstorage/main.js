function createstorage(key) {
  const store = JSON.parse(localStorage.getItem(key)) ?? {};

  const save = () => {
    localStorage.setItem(key, JSON.stringify(store));
  };

  const storage = {
    get(key) {
      return store[key];
    },
    set(key, value) {
      store[key] = value;
      save();
    },
    remove(key) {
      delete store[key];
      save();
    },
  };
  return storage;
}

// Profile.js
const ProfileSetting = createstorage("profile_setting");

console.log(ProfileSetting.set("fullname"));
ProfileSetting.set("fullname", "Vy");
ProfileSetting.set("age", "20");
