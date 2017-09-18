$(document).ready(onReady);

function onReady() {
    $('#addTaskButton').prop('disabled', true);
    $('#taskIn').keyup(function () {
        $('#addTaskButton').prop('disabled', this.value == '' ? true : false);
    });
    $('#addTaskButton').on('click', addTask);
    $('#dataArea').on('click', '#completeTask', completeTask);
    $('#dataArea').on('click', '#deleteTask', deleteTask);
    getTasks();
};

function getTasks(){
    console.log('getTasks running');
    $.ajax({
        type: 'GET',
        url: '/tasks',
        success: function (serverResp) {
            $('#taskTableBody').empty();
            $('#completedTasksBody').empty();
            // logs when response is made
            console.log('tasks get route resp ->', serverResp);
            if (serverResp.length === 0) {
                $('#taskTable').hide();
                $('#tasksPresentHead').hide();
                $('#tasksDoneHead').show();
            } else {
                $('#taskTable').show();
                $('#tasksPresentHead').show();
                $('#tasksDoneHead').hide();
                for (var i = 0; i < serverResp.length; i++) {
                    console.log(serverResp[i]);
                    var $taskRow = $('<tr class="taskRow" data-id="' + serverResp[i].id + '">');
                    $taskRow.append('<td class="taskItem">' + serverResp[i].task);
                    $taskRow.append('<td class="dueItem">' + serverResp[i].due);
                    if (serverResp[i].completed != true) {
                        // $taskRow.append('<td>' + '<input value="Complete" type="button" class="btn btn-success" id="completeTask">');
                        $taskRow.append('<td>' + '<button class="btn btn-success" id="completeTask"><span class="glyphicon glyphicon-ok"></span></button>');
                    } else {
                        $taskRow.append('<td>');
                    }
                    //$taskRow.append('<td>' + '<input value="Complete" type="button" class="btn btn-success" id="completeTask">');
                    $taskRow.append('<td>' + '<button class="btn btn-danger" id="deleteTask"><span class="glyphicon glyphicon-trash"></span></button>');
                    if (serverResp[i].completed) {
                        $('#completedTasksBody').append($taskRow);
                    } else {
                        $('#taskTableBody').append($taskRow);
                    }
                    if (serverResp[i].completed) {
                        $('.taskRow[data-id="' + serverResp[i].id + '"]').css('text-decoration', 'line-through');
                    }
                }
            }
        }
    });
};

function addTask(){
    var task = $('#taskIn').val();
    if ($('#dateIn').val()) {
        var time = $('#hourIn').val() + ':' + $('#minutesIn').val() + ' ' + $('#ampmIn').val();
        var dateMo = $('#dateIn').val().substring(5, 7);
        var dateDay = $('#dateIn').val().substring(8);
        var dateYear = $('#dateIn').val().substring(0, 4);
        var date = time + ' ' + dateMo + '/' + dateDay +'/' + dateYear;
    } else {
        var date = '';
    }
    console.log('addTask running with task: ' + task + ' and date: ' + date);
    var objectToSend = {
        task: task,
        due: date
    }
    console.log('objectToSend ->', objectToSend);
    
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: objectToSend,
        success: function (serverResp) {
            console.log('tasks post route resp ->', serverResp);
            $('#dateIn').val('');
            $('#taskIn').val('');
            getTasks();
        }
    })
};

function completeTask(){
    var thisId = $(this).parent().parent().data('id');
    var objectToSend = {id: thisId};
    console.log('completeTask running on id', thisId);
    $.ajax({
        method: 'POST',
        url: '/tasks/complete',
        data: objectToSend,
        success: function (serverResp) {
            console.log('complete tasks post route resp ->', serverResp);
            getTasks();
        }
    })
};

function deleteTask(){
    if (confirm('This cannot be undone. Press OK to delete this task for all eternity.')) {
    var thisId = $(this).parent().parent().data('id');
    // var objectToSend = { id: thisId };
    console.log('deleteTask running on id', thisId);
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + thisId,
        success: function (serverResp) {
            console.log('delete tasks delete route resp ->', serverResp);
            getTasks();
        }
    })
    };
};