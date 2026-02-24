import React from 'react';

function AuthForm({title, fields, buttonText, onSubmit}) {
    return (
        <div className="container">
            <div className="card">

                <h2 className="title">{title}</h2>

                <form onSubmit={onSubmit}>
                    {fields.map((field, index)=>(
                        <input
                            key={index}
                            name={field.name}
                            className="input"
                            type={field.type}
                            placeholder={field.placeholder}
                        />
                    ))}

                    <button type="submit" className="button">
                        {buttonText}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default AuthForm;
