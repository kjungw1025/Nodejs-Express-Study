// 댓글 로딩
async function getComment(id) {
    try {
        const res = await axios.get(`/post/${id}/comments`);
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML = '';
        comments.map(function (comment) {
            // 로우 셀 추가
            const row = document.createElement('tr');
            let = td = document.createElement('td');
            td.textContent = comment.User.nick;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);

            const edit = document.createElement('button');
            edit.textContent = '수정';

            const remove = document.createElement('button');
            remove.textContent = '삭제';

            const myId = document.querySelector('#my-id');

            if (parseInt(myId.value, 10) === parseInt(comment.User.id, 10)) {
                edit.addEventListener('click', async () => {
                    const newComment = prompt('바꿀 내용을 입력하세요');
                    if (!newComment) {
                        return alert('내용을 반드시 입력하셔야 합니다');
                    }
                    try {
                        await axios.patch(`/post/${id}/comment/${comment.id}`, { comment: newComment });
                        getComment(id);
                    } catch (err) {
                        console.error(err);
                    }
                });

                // 삭제 버튼 클릭 시
                remove.addEventListener('click', async () => {
                    try {
                        await axios.delete(`/post/${id}/comment/${comment.id}`);
                        getComment(id);
                    } catch (err) {
                        console.error(err);
                    }
                });
            }

            // 버튼 추가
            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);

            tbody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
    }
}

// 댓글 등록시
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.querySelector('#my-id').value;
    const postid = e.target.postid.value;
    const comment = e.target.comment.value;

    if (!id) {
        return alert('아이디를 입력하세요');
    }
    if (!comment) {
        return alert('댓글을 입력하세요');
    }

    try {
        await axios.post(`/post/${postid}/comment`, { comment });
        getComment(postid);
    }
    catch (error) {
        console.error(err);
    }

    // form 양식 초기화
    e.target.postid.value = '';
    e.target.comment.value = '';    
});