
const initialState = {
    coffeeRecord: {},
    coffeeRecords: [],
    totalNetWeight: null,
    totalTareWeight: null,
    totalBags: null,
    totalUsers: "15",
    performancePerGrade: [],
    totalWeightPerWeek: [],
    totalWeightPerMonth: [],
    dailyDeliveries: [],
    users:[],
    lots: [],
    catalogue: {
        day: "",
        date: "",
        bags: "",
        lots: "",
        millers: "",
        coffeeRecords: []
    }, 
    success: false,
    error: false,
    loading: false,
    mainCatalogue: [],
    miscelleneousCatalogue: [],
    finalCatalogue: [],
    mainGrades: ['AA','E','PB', 'AB', 'C', 'TT', 'T'],
    miscelleneousGrades: ['SB', 'HE', 'UG3', 'UG2', 'UG1', 'UG', 'T', 'TT', 'C', 'AB', 'PB', 'AA', 'NL', 'NH', 'RL', 'RH', 'ML', 'MH']
        
}


export default initialState