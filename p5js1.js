
function arr_load(rows, cols, cont) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
        arr.push([]);
        for (let j = 0; j < cols; j++) {
            arr[i].push(cont);
        }
    } return arr;
}
function arr_aranger(arr, ind) {
    let temp = []
    for (let i = 0; i < arr.length; i++) {
        if (i == ind) {
            continue;
        }
        temp.push(arr[i])
    }
    return temp
}

const x = () => { return Math.random(); };
const c = () => { return Math.ceil(Math.random() * 10); };
const rnd_i = (min, max) => { return Math.floor(x() * (max - min)) + min; }

class B {
    static bid = 0
    static colours = [0, 1, 2, 3, 4, 5, 6]
    constructor() {
        this.id = B.bid;
        this.color = rnd_i(1, B.colours.length);
        B.bid++;
    }
}

class Table {
    constructor(rows, cols, start_up = 3) {
        this.rows = rows;
        this.cols = cols;
        this.start_up = 5;
        this.point = 0
        this.interupt=false
        this.cells = document.querySelectorAll("[id^=cell]")
        this.area = arr_load(this.rows, this.cols, 0);
        this.produce_ball(this.start_up);
        this.start_up = start_up;
        this.add_listeners()
        this.check_board()
    }
    produce_ball(how_many_ball = this.start_up) {
        const arr_of_balls = []
        for (let i = 0; i < how_many_ball; i++) {
            arr_of_balls.push(new B());
        }
        this.place_it(arr_of_balls)
        this.check_board()
    }
    place_it(what_to_place) {
        let empity_space = []
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.area[r][c] === 0) {
                    empity_space.push([r, c])
                }
            }
        }
        if (!(empity_space.length < what_to_place.length)) {
            for (const item of what_to_place) {
                let rnd_index = rnd_i(0, empity_space.length)
                let rnd_place = empity_space[rnd_index]
                empity_space = arr_aranger(empity_space, rnd_index)
                this.area[rnd_place[0]][rnd_place[1]] = item
            }
        }
        else {
            if (empity_space.length === 0) {
                console.log("game over - thank GOD")
            } else {
                this.produce_ball(empity_space.length)
            }
        }
        this.check_board()
    }

    move_ball(choice, destination) {
        if (this.area[choice[0]][choice[1]] !== 0 && this.area[destination[0]][destination[1]] === 0) {
            this.area[destination[0]][destination[1]] = this.area[choice[0]][choice[1]];
            this.area[choice[0]][choice[1]] = 0;
            this.check_board()
            if(this.interupt===false){
                this.produce_ball(this.start_up)
            }
            this.visualize()
            this.interupt=false
        }
        else {
            this.interupt=false
            console.log("place is ocupied")
        }
    }
    check_board() {
        this.check_rows()
        this.check_cols()
        this.check_cro1()
        this.check_cro2()
        this.visualize()
    }
    check_ball(r, c) {
        return this.area[r][c] !== 0
    }
    check_rows() {
        let prev_color = null
        let ball_counter = 0
        let start_col = []
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.area[r][c] !== 0) {
                    let curr_clr = this.area[r][c].color
                    if (curr_clr !== prev_color) {
                        if (ball_counter > 4) {
                            this.destroy_balls(start_col)
                            ball_counter = 1
                            start_col = [[r, c]]
                        }
                        else {
                            ball_counter = 1
                            start_col = [[r, c]]
                        }
                        prev_color = curr_clr
                    }
                    else {
                        ball_counter++
                        start_col.push([r, c])
                    }
                }
                else {
                    if (ball_counter > 4) {
                        this.destroy_balls(start_col)
                        start_col = []
                    }
                    else {
                        ball_counter = 0
                        start_col = []

                    }
                    prev_color = null
                }
            }
            if (ball_counter > 4) {
                this.destroy_balls(start_col);
            }
            prev_color = null
            ball_counter = 0
            start_col = []
        }
    }
    check_cols() {
        let prev_color = null
        let ball_counter = 0
        let start_col = []
        let curr_clr = null
        for (let c = 0; c < this.cols; c++) {
            prev_color = null
            ball_counter = 0
            start_col = []
            for (let r = 0; r < this.rows; r++) {
                if (!(this.area[r][c] !== 0)) {
                    if (prev_color == null) {
                        //console.log(r,c,"no ball no prev no nothing")
                    }
                    else {
                        if (ball_counter > 4) {
                            this.destroy_balls(start_col)
                            start_col = []
                        } else {
                            start_col = []
                        }
                        prev_color = null

                    }
                }
                else {
                    curr_clr = this.area[r][c].color
                    if (prev_color == curr_clr) {

                        ball_counter += 1
                        start_col.push([r, c])
                    }
                    else {
                        if (ball_counter > 4) {
                            this.destroy_balls(start_col)
                            ball_counter = 1
                            start_col = [[r, c]]
                        } else {
                            ball_counter = 1
                            start_col = [[r, c]]
                        }
                        prev_color = curr_clr
                    }
                }
            }
            if (ball_counter > 4) {
                this.destroy_balls(start_col)
            } else {
            }

        }
    }
    check_cro1() {
        let prev_clr = null
        let ball_counter = 0
        let start_col = []
        for (let deviation = -4; deviation < this.rows - 4; deviation++) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (this.area[r][c] === undefined || r !== c + deviation) {
                        continue;
                    }
                    else {
                        if (this.area[r][c] !== 0) {
                            let curr_clr = this.area[r][c].color
                            if (curr_clr !== prev_clr) {
                                if (ball_counter > 4) {
                                    this.destroy_balls(start_col)
                                    start_col = [[r, c]]
                                    ball_counter = 1
                                }
                                else {
                                    ball_counter = 1
                                    start_col = [[r, c]]
                                }
                                prev_clr = curr_clr
                            }
                            else {
                                ball_counter++
                                start_col.push([r, c])
                            }
                        }
                        else {
                            if (ball_counter > 4) {
                                this.destroy_balls(start_col)
                                start_col = []
                                ball_counter = 0
                            }
                            else {

                                ball_counter = 0
                                start_col = []
                            }
                            prev_clr = null
                        }
                    }
                }

            }
            if (ball_counter > 4) {
                this.destroy_balls(start_col)

            }
            prev_clr = null
            ball_counter = 0
            start_col = []
        }
        return true
    }
    check_cro2() {
        let prev_clr = null
        let ball_counter = 0
        let start_col = []
        for (let deviation = 4; deviation < this.rows + 4; deviation++) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if (r + c !== deviation) {
                        continue;
                    } else {
                        if (this.area[r][c] !== 0) {
                            let curr_clr = this.area[r][c].color
                            if (curr_clr !== prev_clr) {
                                if (ball_counter > 4) {
                                    this.destroy_balls(start_col)
                                    ball_counter = 1
                                    start_col = [[r, c]]
                                }
                                else {
                                    ball_counter = 1
                                    start_col = [[r, c]]
                                }
                                prev_clr = curr_clr
                            } else {
                                ball_counter++
                                start_col.push([r, c])
                            }
                        } else {
                            if (ball_counter > 4) {
                                this.destroy_balls(start_col)
                                ball_counter = 0
                                start_col = []
                            }
                            else {
                                ball_counter = 0
                                start_col = []
                            }
                            prev_clr = null

                        }
                    }
                }
            }
            if (ball_counter > 4) {
                this.destroy_balls(start_col)
            }
            prev_clr = null
            ball_counter = 0
            start_col = []
        }
        return true
    }
    destroy_balls(where) {
        this.point += where.length * 2
        for (const bmb of where) {
            this.area[bmb[0]][bmb[1]] = 0
        };
        this.change_point()
        this.interupt=true
        //this.visualize()
    }

    //Implementation Layer
    add_listeners() {
        this.mouse_select()
        this.visualize()
    }
    visualize() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.cells[r * this.rows + c].innerHTML = ""

                let ball = document.createElement("div")
                ball.classList.add(`ball`, `ball${this.area[r][c].color}`)
                if (this.area[r][c] !== 0) {
                    if (this.cells[r * this.rows + c].hasChildNodes()) {

                    } else {
                        this.cells[r * this.rows + c].appendChild(ball)
                    }
                }
                else { this.cells[r * this.rows + c].innerHTML = "+" }
            }
        }
    }
    change_point() {
        document.getElementById("point").innerHTML = this.point
    }

    mouse_select() {
        let first_click = null
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.cells[r * this.rows + c].addEventListener("click", () => {

                    if (first_click === null) {
                        if (this.area[r][c] !== 0) {
                            first_click = [r, c]
                        }
                        else {
                        }
                    } else {
                        if (this.area[r][c] === 0) {
                            this.move_ball(first_click, [r, c]);
                            first_click = null;
                        } else {
                            first_click = null
                        }
                    }

                })
            }
        }
    }

}




let t1 = new Table(9, 9);

