import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch {
    console.log("something went wrong");
  }
};

const create = async (newObject) => {
  try {
    const response = await axios.post(baseUrl, newObject);
    return response.data;
  } catch {
    console.log("something went wrong");
  }
};

const vote = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    const objectToChange = response.data;
    const newObject = { ...objectToChange, votes: objectToChange.votes + 1 };
    const updatedObject = await axios.put(`${baseUrl}/${id}`, newObject);
    return updatedObject.data;
  } catch {
    console.log("something went wrong");
  }
};

export default { getAll, create, vote };
