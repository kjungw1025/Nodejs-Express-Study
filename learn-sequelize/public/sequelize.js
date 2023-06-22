// 사용자 이름 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {
    el.addEventListener('click', function () {
        const id = el.querySelector('id').textContent;
        getComment(id);
    });
});

// 댓글 로딩
async function getComment(id) {
    try {
        const res = await axios.get(`/users/${id}/comments`);
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML = '';
        comments.map(function (comment) {
            // 로우 셀 추가
            const row = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = comment.id;
            td = document.createElement('td');
            td.textContent = comment.User.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);

            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => {
                const newComment = prompt('바꿀 내용을 입력하세요');
                if (!newComment) {
                    return alert('내용을 반드시 입력하셔야 합니다');
                }
                try {
                    await axios.patch(`/comments/${comment.id}`, { comment: newComment });
                    getComment(id);
                } catch (err) {
                    console.error(err);
                }
            });

            const remove = document.createElement('button');
            remove.textContent = '삭제';
            // 삭제 버튼 클릭 시
            remove.addEventListener('click', async () => {
                try {
                    await axios.delete(`comments/${comments.id}`);
                    getComment(id);
                } catch (err) {
                    console.error(err);
                }
            });

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