const Desk = () => {
  const handleClick = () => {
    console.log(' click div ');
  };

  // @ts-ignore
  const handleAddBtn = (e) => {
    e.stopPropagation();
    console.log('add btn click ');
  };

  // @ts-ignore
  const handleCancelBtn = (e) => {
    e.stopPropagation();
    console.log('cancel btn click ');
  };

  return (
    <div className="mt-10 flex justify-center">
      <div
        onClick={handleClick}
        className="w-[250px] border border-red-900 p-4 flex justify-between items-center rounded-md"
      >
        <button
          onClick={handleAddBtn}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Add
        </button>
        <button
          onClick={handleCancelBtn}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Desk;
