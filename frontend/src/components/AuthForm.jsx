import React from 'react';

function AuthForm({title, fields, buttonText, onSubmit, error}) {
    return (
        <div className="container">
            <div className="card   ">

                <h2 className="title  ">{title}</h2>

                <form onSubmit={onSubmit} encType="multipart/form-data">
                    {fields.map((field, index)=>(
                       field.type === "file" ? (
  <label key={field.name || index} className="file-upload text-black font-bold">
    Upload Profile Photo
    <input
      type="file"
      name={field.name}
      accept="image/*"
      hidden
    />
  </label>
) : (
  <input
    key={field.name || index}
    type={field.type}
    name={field.name}
    placeholder={field.placeholder}
  />
)))}

    {error && <p className="error  font-bold text-xl text-red-500">{error}</p>}

                    <button type="submit" className="button">
                        {buttonText}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default AuthForm;
