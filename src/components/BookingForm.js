import React from 'react'

function BookingForm({handleSubmit, setIsOpen, formData, setFormData, handleChange}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Schedule a Game</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Players */}
        <div>
          <label className="block text-gray-700 mb-1">Players</label>
          <input
            type="number"
            name="players"
            value={formData.players}
            onChange={handleChange}
            placeholder="Enter total players"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-gray-700 mb-1">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Sport */}
        <div>
          <label className="block text-gray-700 mb-1">Sport</label>
          <select
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          >
            <option value="" disabled>
              Select a sport
            </option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Tennis">Tennis</option>
            <option value="Cricket">Cricket</option>
            <option value="Hockey">Hockey</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default BookingForm