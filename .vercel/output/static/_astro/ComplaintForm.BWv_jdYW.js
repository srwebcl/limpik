import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as i}from"./index.WFquGv8Z.js";function b(){const[a,s]=i.useState({fullName:"",rut:"",email:"",phone:"",relation:"",incidentDate:"",incidentType:"",description:"",anonymous:!1}),[l,o]=i.useState(!1),n=r=>{const{name:d,value:c,type:m,checked:u}=r.target;s(p=>({...p,[d]:m==="checkbox"?u:c}))},t=r=>{r.preventDefault(),console.log("Complaint submitted:",a),setTimeout(()=>o(!0),1e3)};return l?e.jsxs("div",{className:"success-message",children:[e.jsx("h3",{children:"Denuncia Recibida"}),e.jsx("p",{children:"Hemos recibido su denuncia. Un encargado de cumplimiento se pondrá en contacto a la brevedad dentro de los plazos legales establecidos."}),e.jsx("p",{children:"La confidencialidad de este reporte está garantizada."}),e.jsx("button",{onClick:()=>o(!1),className:"btn-reset",children:"Ingresar otra denuncia"})]}):e.jsxs("form",{onSubmit:t,className:"complaint-form",children:[e.jsx("div",{className:"alert-info",children:e.jsxs("p",{children:[e.jsx("strong",{children:"Canal de Denuncias Ley Karin:"})," Este formulario es confidencial. Puede optar por realizar una denuncia anónima si lo prefiere."]})}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{children:[e.jsx("input",{type:"checkbox",name:"anonymous",checked:a.anonymous,onChange:n}),"Quiero realizar una denuncia anónima"]})}),!a.anonymous&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Nombre Completo"}),e.jsx("input",{type:"text",name:"fullName",required:!a.anonymous,value:a.fullName,onChange:n})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"RUT"}),e.jsx("input",{type:"text",name:"rut",required:!a.anonymous,value:a.rut,onChange:n})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Email de Contacto"}),e.jsx("input",{type:"email",name:"email",required:!a.anonymous,value:a.email,onChange:n})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Teléfono"}),e.jsx("input",{type:"tel",name:"phone",value:a.phone,onChange:n})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Relación con la Empresa"}),e.jsxs("select",{name:"relation",required:!a.anonymous,value:a.relation,onChange:n,children:[e.jsx("option",{value:"",children:"Seleccione..."}),e.jsx("option",{value:"Colaborador Interno",children:"Colaborador Interno"}),e.jsx("option",{value:"Proveedor",children:"Proveedor"}),e.jsx("option",{value:"Cliente",children:"Cliente"}),e.jsx("option",{value:"Ex-colaborador",children:"Ex-colaborador"})]})]})]}),e.jsx("div",{className:"separator"}),e.jsx("h4",{children:"Detalles del Incidente"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Tipo de Incidente *"}),e.jsxs("select",{name:"incidentType",required:!0,value:a.incidentType,onChange:n,children:[e.jsx("option",{value:"",children:"Seleccione..."}),e.jsx("option",{value:"Acoso Laboral",children:"Acoso Laboral"}),e.jsx("option",{value:"Acoso Sexual",children:"Acoso Sexual"}),e.jsx("option",{value:"Violencia en el Trabajo",children:"Violencia en el Trabajo"}),e.jsx("option",{value:"Discriminación",children:"Discriminación"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Fecha del Incidente (Aproximada) *"}),e.jsx("input",{type:"date",name:"incidentDate",required:!0,value:a.incidentDate,onChange:n})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Descripción de los Hechos *"}),e.jsx("textarea",{name:"description",rows:"6",required:!0,placeholder:"Describa detalladamente lo sucedido, involucrados y testigos si los hay.",value:a.description,onChange:n})]}),e.jsx("button",{type:"submit",className:"btn-submit-alert",children:"Enviar Denuncia Confidencial"}),e.jsx("style",{children:`
        .complaint-form {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            max-width: 800px;
            margin: 0 auto;
        }
        
        .alert-info {
            background: #ebf8ff;
            border-left: 4px solid #4299e1;
            padding: 1rem;
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        
        @media (max-width: 600px) {
            .form-row { grid-template-columns: 1fr; }
        }
        
        .form-group { margin-bottom: 1.5rem; }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.25rem;
        }
        
        .separator {
            border-top: 1px solid #e2e8f0;
            margin: 2rem 0;
        }
        
        .btn-submit-alert {
            width: 100%;
            padding: 1rem;
            background: #e53e3e; /* Red for alert/important */
            color: white;
            border: none;
            border-radius: 0.25rem;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-submit-alert:hover {
            background: #c53030;
        }

        .success-message {
            text-align: center;
            background: #f0fff4;
            padding: 3rem;
            border-radius: 0.5rem;
            color: #2f855a;
        }

        .btn-reset {
            margin-top: 1rem;
            background: none;
            border: none;
            text-decoration: underline;
            color: #2f855a;
            cursor: pointer;
        }
      `})]})}export{b as default};
