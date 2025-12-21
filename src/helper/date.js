export const startOfDate = (startDate) => {
    if (startDate) {
      const startOfDate = new Date(startDate)
  
      return new Date(
        Date.UTC(
          startOfDate.getFullYear(),
          startOfDate.getMonth(),
          startOfDate.getDate(),
          0,
          0,
          0
        )
      )
    }
  }

 export const endOfDate = (endDate) => {
    if (endDate) {
      const endOfDate = new Date(endDate)
      return new Date(
        Date.UTC(
          endOfDate.getFullYear(),
          endOfDate.getMonth(),
          endOfDate.getDate(),
          0,
          0,
          0
        )
      )
    }
  }

  export const customDate = (date) => {
    if (date) {
      const customDate = new Date(date)
  
      return new Date(
        Date.UTC(
          customDate.getFullYear(),
          customDate.getMonth(),
          customDate.getDate() + 1,
          0,
          0,
          0
        )
      )
    }
  }
