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
          ]
        },
       {
          name: "Coffee",
          iconKey: "coffee",
          emoji: "☕",
          isActive: (pathname) => pathname.startsWith("/products"),
          dropdown: [
            { name: "Add Coffee", link: "/coffee/add", iconKey: "add" },
            { name: "View Coffee Records", link: "/coffee/view", iconKey: "list" },
            { name: "Stock Summary", link: "/coffee/summary", iconKey: "file" }
          ]
        },
        {
            name: "Catalogue",
            iconKey: "Catalogue",
            emoji: "📘",
            isActive: (pathname) => pathname.startsWith("/products"),
            dropdown: [
              { name: "Add Catalogue", link: "/Catalogue/add", iconKey: "add" },
              { name: "View Catalogues", link: "/Catalogue/view", iconKey: "list" },
              { name: "Sale Summary", link: "/Catalogue/summary", iconKey: "file" }
            ]
          },
          {
            name: "Payment",
            iconKey: "payment",
            emoji: "💰",
            isActive: (pathname) => pathname.startsWith("/products"),
            dropdown: [
              { name: "Add payment", link: "/payment/add", iconKey: "add" },
              { name: "View payments", link: "/payment/view", iconKey: "list" },
              { name: "Sale Summary", link: "/payment/summary", iconKey: "file" }
            ]
          },
        
        
      ]
    },
    coffeeRecords: [],
    loading: false,
    error: null,
    success: false,
    CoffeeUploadFormData: {
        outturnNumber: '',
        markNumber: '',
        certificate: '',
        season: '',
        grade: '',
        bags: '',
        pockets: '',
        weight: '',
        millerCode: '',
        warehouse: '',
        status: '',
    },
    FarmerUploadFormData: {
        name: '',
        nation_id: '',
        mark: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        location: '',
        bank: '',
        branch: '',
        account: '',
        currency: '',
    }
  };
  