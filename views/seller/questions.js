const ProductQuestions = Vue.component('product-questions', {
    data () {
        return {
            questions: {
                search: null,
                headers: [
                    {text: 'ID', sortable: true, align: 'start', value: 'qId'},
                    {text: 'Question', sortable: true, align: 'start', value: 'question'},
                    {text: 'Name', sortable: true, align: 'start', value: 'author'},
                    {text: 'Product Name', sortable: true, align: 'start', value: 'product'},
                    {text: 'Time Placed', sortable: true, align: 'start', value: 'timestamp'},
                    {text: 'Status', sortable: true, align: 'center', value: 'status'},
                    {text: 'Actions', sortable: false, align: 'end', value: 'actions'}
                ],
                items: []
            },
            dialog: {
                view: false
            },
            view: {},
            answer: null
        }
    },
    mounted () {
        let formData = new FormData()
        formData.set('uid', sessionStorage.uid)
        axios.post('./sql/get_all_questions.php', formData).then((res) => {
            console.log(res.data)
            this.questions.items = res.data
        })
    },
    methods: {
        viewQuestion (item) {
            this.view = item
            this.dialog.view = true
        },
        answerQuestion () {
            if (this.$refs.answer.validate()) {
                let formData = new FormData()
                formData.set('id', this.view.qId)
                formData.set('answer', this.answer)
                axios.post('./sql/answer_question.php', formData).then((res) => {
                    console.log(res.data)
                    this.view.answer = this.answer
                    this.$refs.answer.reset()
                    this.dialog.view = false
                })
            }
        }
    },
    template: `<v-container>
    <v-card tile elevation="0">
    <v-card-title>Questions<v-spacer/>
    <v-text-field rounded dense filled placeholder="Search" v-model="questions.search"/>
    </v-card-title>
    <v-card-text>
    <v-data-table :search="questions.search" :headers="questions.headers" :items="questions.items">
    <template v-slot:item.receiver="{item}" class="text-capitalize">{{item.receiver}}</template>
    <template v-slot:item.product="{item}" class="text-capitalize">{{item.name}}</template>
    <template v-slot:item.timestamp="{item}">{{$convertToShortDateTime(item.timestamp)}}</template>
    <template v-slot:item.status="{item}"><v-chip dark small :color="item.answer ? 'green' : 'grey lighten-1'">{{item.answer ? 'Answered' : 'Pending'}}</v-chip></template>
    <template v-slot:item.actions="{item}">
    <v-btn small icon @click="viewQuestion(item)"><v-icon small>mdi-eye</v-icon></v-btn>
    </template>
    </v-data-table>
    </v-card-text>
    </v-card>
    <v-dialog v-model="dialog.view" max-width="480">
    <v-card>
    <v-card-title>Question Info</v-card-title>
    <v-card-text>
    <div class="mb-3">
    <div class="caption">Question</div>
    <div class="text-body-2 black--text">{{view.question}}</div>
    </div>
    <div v-show="view.answer">
    <div class="caption">Answer</div>
    <div class="text-body-2 black--text">{{view.answer}}</div>
    </div>
    </v-card-text>
    <v-card-text>
    <v-form ref="answer" v-show="!view.answer">
    <v-textarea :rules="$rules.required" rounded filled placeholder="Answer" v-model="answer"/>
    </v-form>
    </v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn rounded depressed color="primary" @click="answerQuestion">Submit</v-btn>
    <v-btn text @click="dialog.view = false">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    </v-container>`    
})