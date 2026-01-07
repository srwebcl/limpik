import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as m}from"./index.WFquGv8Z.js";function b({serviceType:l=""}){const[r,t]=m.useState({name:"",email:"",phone:"",company:"",service:l,message:""}),[i,s]=m.useState("idle"),o=n=>{const{name:a,value:d}=n.target;t(u=>({...u,[a]:d}))},c=async n=>{n.preventDefault(),s("submitting");try{await new Promise(a=>setTimeout(a,1500)),console.log("Form submitted:",r),s("success"),t({name:"",email:"",phone:"",company:"",service:"",message:""})}catch(a){console.error(a),s("error")}};return i==="success"?e.jsxs("div",{className:"form-success",children:[e.jsx("h3",{children:"¡Mensaje Enviado!"}),e.jsx("p",{children:"Gracias por cotizar con Limpik. Nos pondremos en contacto contigo a la brevedad."}),e.jsx("button",{onClick:()=>s("idle"),className:"btn-reset",children:"Enviar otro mensaje"})]}):e.jsxs("form",{onSubmit:c,className:"contact-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"name",children:"Nombre Completo *"}),e.jsx("input",{type:"text",id:"name",name:"name",required:!0,value:r.name,onChange:o,placeholder:"Ej: Juan Pérez"})]}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Email Corporativo *"}),e.jsx("input",{type:"email",id:"email",name:"email",required:!0,value:r.email,onChange:o,placeholder:"nombre@empresa.com"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"phone",children:"Teléfono *"}),e.jsx("input",{type:"tel",id:"phone",name:"phone",required:!0,value:r.phone,onChange:o,placeholder:"+56 9 1234 5678"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"company",children:"Empresa / Organización *"}),e.jsx("input",{type:"text",id:"company",name:"company",required:!0,value:r.company,onChange:o,placeholder:"Nombre de su empresa"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"service",children:"Servicio de Interés"}),e.jsxs("select",{id:"service",name:"service",value:r.service,onChange:o,children:[e.jsx("option",{value:"",children:"Seleccione un servicio..."}),e.jsx("option",{value:"Limpieza de Empresas",children:"Limpieza de Empresas"}),e.jsx("option",{value:"Limpieza de Edificios",children:"Limpieza de Edificios"}),e.jsx("option",{value:"Otro",children:"Otro"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"message",children:"Detalles del Requerimiento"}),e.jsx("textarea",{id:"message",name:"message",rows:"4",value:r.message,onChange:o,placeholder:"Mecione m2 aproximados, ubicación, frecuencia, etc."})]}),e.jsx("button",{type:"submit",className:"btn-submit",disabled:i==="submitting",children:i==="submitting"?"Enviando...":"Solicitar Cotización"}),i==="error"&&e.jsx("p",{className:"error-msg",children:"Hubo un error al enviar el mensaje. Por favor intente nuevamente."}),e.jsx("style",{children:`
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        
        @media (max-width: 600px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
          color: #333;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #0056b3;
          box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
        }

        .btn-submit {
          width: 100%;
          background-color: #FF8000;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #FF9933;
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .form-success {
            text-align: center;
            padding: 3rem 1rem;
            background: #f0fff4;
            border-radius: 0.5rem;
            border: 1px solid #c6f6d5;
        }
        
        .form-success h3 {
            color: #2f855a;
            margin-bottom: 1rem;
        }
        
        .btn-reset {
            background: none;
            border: none;
            color: #2f855a;
            text-decoration: underline;
            cursor: pointer;
            margin-top: 1rem;
        }

        .error-msg {
            color: #e53e3e;
            margin-top: 1rem;
            font-size: 0.9rem;
        }
      `})]})}export{b as default};
