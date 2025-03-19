import { Search } from 'lucide-react'
import React from 'react'

const Searchbar = () => {
  return (
    <div>
      <form>
        <div className="relative">
          <span className="absolute left-3 top-3 text-lg"><Search /></span>
          <input
            // {...register("username")}
            className="w-full py-3 px-12 border rounded-lg focus:ring focus:ring-blue-400 shadow-md bg-gray-50"
            placeholder="Enter your username"
          />
        </div>
      </form>
    </div>
  )
}

export default Searchbar