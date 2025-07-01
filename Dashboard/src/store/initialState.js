// src/store/initialState.js

export const globalInitialState = {
  apiBaseUrl: 'http://127.0.0.1:8000/api',

  navigation: {
    items: [
      {
        name: "Farmers",
        iconKey: "farmers",
        emoji: "👩‍🌾",
        isActive: (pathname) => pathname.startsWith("/farmers"),
        dropdown: [
          { name: "Add Farmer", link: "/farmers/add", iconKey: "add" },
          { name: "Farmers Records", link: "/farmers/view", iconKey: "list" },
        ]
      },
      {
        name: "Coffee",
        iconKey: "coffee",
        emoji: "☕",
        isActive: (pathname) => pathname.startsWith("/coffee"),
        dropdown: [
          { name: "Add Coffee", link: "/coffee/add", iconKey: "add" },
          { name: "View Coffee Records", link: "/coffee/view", iconKey: "list" },
          { name: "Stock Summary", link: "/coffee/summary", iconKey: "file" }
        ]
      },
      {
        name: "Catalogue",
        iconKey: "catalogue",
        emoji: "📘",
        isActive: (pathname) => pathname.startsWith("/catalogue"),
        dropdown: [
          { name: "Add Catalogue", link: "/catalogue/add", iconKey: "add" },
          { name: "View Catalogues", link: "/catalogue/view", iconKey: "list" },
          { name: "Sale Summary", link: "/catalogue/summary", iconKey: "file" }
        ]
      },
      {
        name: "Payment",
        iconKey: "payment",
        emoji: "💰",
        isActive: (pathname) => pathname.startsWith("/payment"),
        dropdown: [
          { name: "Add Payment", link: "/payment/add", iconKey: "add" },
          { name: "View Payments", link: "/payment/view", iconKey: "list" },
          { name: "Payment Summary", link: "/payment/summary", iconKey: "file" }
        ]
      }
    ]
  },

  farmer: {
    farmers: [],
    loading: false,
    error: null,
    success: false,
    FarmerUploadFormData: {
      name: '',
      nation_id: '',
      mark: '',
      code: '',
      address: '',
      phone: '',
      email: '',
      location: '',
      county: '',
      town: '',
      bank: '',
      branch: '',
      account: '',
      currency: '',
    }
  },

  coffee: {
    coffeeRecords: [],
    loading: false,
    error: null,
    success: false,
    CoffeeUploadFormData: {
      outturn: '',
      bulkoutturn: '',
      mark: '',
      type: '',
      grade: '',
      bags: 0,
      pockets: 0.0,
      weight: '',
      sale: '',
      season: '2024/2025',
      mill: '',
      milling_charges: 0.0,
      warehouse: '',
      warehouse_charges: 0.0,
      brokerage_charges: 0.0,
      export_charges: 0.0,
      transport_charges: 0.0,
      price: 0.0,
      net_value: 0.0,
      gross_value: 0.0,
      certificate: '',
      status: '',
      catalogue: '',
      catalogue_type: '',
      reserve: 0,
      buyer: '',
      remarks: '',
    }
  }
};
