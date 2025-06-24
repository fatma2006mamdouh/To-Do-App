document.addEventListener('DOMContentLoaded',()=>{
    const taskInput=document.getElementById("task-input")
    const addTaskBtn=document.getElementById("add-task-btn")
    const taskList=document.getElementById("task-list")
    const emptyImage=document.querySelector(".empty-image")
    const todosContainer=document.querySelector(".todos-container")
    const progress=document.getElementById("progress")
    const progressNmbers=document.getElementById("numbers")
    
    const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.pitch = 0.5;      
    utterance.rate = 1.1;       
    speechSynthesis.speak(utterance);
};
    //function to remove empty-image if there is li

  const toggleEmptyState=()=>{
        emptyImage.style.display=taskList.children.length===0?'block':'none';
        todosContainer.style.width=taskList.children.length >0 ?'100%':'50%';
    }
     const updateProgress=(checkboxCompletion=true)=>{
        const totalTasks=taskList.children.length;
        // Check if a checked checkbox is found before accessing length
       const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        progress.style.width=totalTasks?`${(completedTasks/totalTasks)*100}%`:'0%';
        progressNmbers.textContent=`${completedTasks} / ${totalTasks}`;

        if(checkboxCompletion && totalTasks>0 && completedTasks===totalTasks){
           celebrete() 
           speak("Congratulations! You did it!");
        }
    }
const saveTaskToLocalStorage=()=>{
    // Select all 'li' elements within taskList directly
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector('.checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const loadTasksFromLocalStorage=()=>{
    const savedTasks=JSON.parse(localStorage.getItem('tasks'))||[];
    savedTasks.forEach(({text,completed})=>addTask(text,completed,false));
    toggleEmptyState();
    updateProgress();
}

//function To Add new Task
    const addTask=(task,completed=false,checkboxCompletion=true)=>{
        const taskText=task || taskInput.value.trim()
       if(!taskText){
        return;
        }
    //Designe Li


       const li=document.createElement("li")
       li.innerHTML=`
         <input type="checkbox" class="checkbox" ${completed?'checked':''}>
        <span>${taskText}</span>
       <div class="task-buttons">
        <button class="edit-btn">
        <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-btn">
        <i class="fa-solid fa-trash"></i>
        </button>
       
       </div>      
        `
       const checkbox=li.querySelector('.checkbox') // Select checkbox within the created li
       const editBtn=li.querySelector('.edit-btn') // Select editBtn within the created li

        if(completed){
            li.classList.add('completed')
            editBtn.disabled=true;
            editBtn.style.opacity='0.5'
            editBtn.style.pointerEvents='none'
        }
        checkbox.addEventListener('change',()=>{
            const isChecked=checkbox.checked
            li.classList.toggle('completed',isChecked)
            editBtn.disabled=isChecked
            editBtn.style.opacity=isChecked?'0.5':'1';
            editBtn.style.pointerEvents=isChecked?'none':'auto'
            updateProgress()
            saveTaskToLocalStorage()
        })


     //edit li

       editBtn.addEventListener('click',()=>{
        if(!checkbox.checked){
            taskInput.value=li.querySelector('span').textContent;
            li.remove()
            toggleEmptyState()
            updateProgress(false)
            saveTaskToLocalStorage()
        }
       })
       //remove li
       li.querySelector(".delete-btn").addEventListener('click',()=>{
        li.remove()
        toggleEmptyState()
        updateProgress()
        saveTaskToLocalStorage()
       })

       taskList.appendChild(li)
       taskInput.value=''
       toggleEmptyState()
       updateProgress(checkboxCompletion)
       saveTaskToLocalStorage()
    }


    //click to add
    addTaskBtn.addEventListener("click", ()=> addTask())
    taskInput.addEventListener('keypress',(e)=>{
        
        if(e.key==='Enter'){
            e.preventDefault();
            addTask()
        }
    })
    loadTasksFromLocalStorage()

 addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();   // ⛔ مهم جدًا هنا
  addTask();
});
});
const celebrete=()=>{
const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});

}
