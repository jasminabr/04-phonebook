import { useState, useEffect } from "react";
import personService from "./services/personService";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  // Merr të dhënat nga serveri
  useEffect(() => {
    console.log("Getting data from server");
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  //  person të ri
  const addPerson = (event) => {
    event.preventDefault();

    if (!newName || !newNumber) {
      setNotificationMessage("Both name and number are required.");
      setNotificationType("error");
      return;
    }

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook. Replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setNotificationMessage(
              `Updated ${newName} with new number ${newNumber}`
            );
            setNotificationType("success");
          })
          .catch((error) => {
            setNotificationMessage("Error updating person: " + error.message);
            setNotificationType("error");
          });
      }
    } else {
      const personObject = { name: newName, number: newNumber };

      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setNotificationMessage(`Added ${newName} with number ${newNumber}`);
          setNotificationType("success");
        })
        .catch((error) => {
          setNotificationMessage("Error adding person: " + error.message);
          setNotificationType("error");
        });
    }
  };

  // Fshij  person
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotificationMessage(`Deleted ${name}`);
          setNotificationType("success");
        })
        .catch(() => {
          setNotificationMessage(
            `Information of ${name} has already been removed from the server`
          );
          setNotificationType("error");
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        type={notificationType}
      />{" "}
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
