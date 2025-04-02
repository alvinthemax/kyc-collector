import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([{ id: 1, text: "", links: [] }]);

  const addStep = () => {
    setSteps([...steps, { id: steps.length + 1, text: "", links: [] }]);
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/saveJson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, steps }),
    });

    if (response.ok) {
      alert("Data berhasil disimpan ke GitHub!");
    } else {
      alert("Gagal menyimpan data.");
    }
  };

  return (
    <div className="container">
      <h1>JSON Data Collector</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <h2>Steps</h2>
      {steps.map((step, index) => (
        <div key={index} className="step">
          <input
            type="text"
            placeholder={`Step ${index + 1}`}
            value={step.text}
            onChange={(e) => {
              const newSteps = [...steps];
              newSteps[index].text = e.target.value;
              setSteps(newSteps);
            }}
          />
          <button onClick={() => removeStep(index)}>-</button>
        </div>
      ))}
      <button onClick={addStep}>+ Add Step</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
