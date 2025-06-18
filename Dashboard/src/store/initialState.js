// src/store/initialState.js

export const globalInitialState = {
    navigation: {
      items: [
        {
          name: "Farmers",
          iconKey: "farmers",
          emoji: "👩‍🌾",
          isActive: (pathname) => pathname.startsWith("/farmers"),
          dropdown: [
            { name: "Add Farmer", link: "/farmers/add", iconKey: "add" },
            { name: "Farmers Records", link: "/farmers", iconKey: "list" },
            { name: "Stock Summaries", link: "/farmers/stock-summaries", iconKey: "file" }
          ]
        }
      ]
    }
  };
  