class Container extends React.Component {
    render() {
      return (
          <div>
            <Recipes/>
          </div>
      )
    }
}

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {recipes: ''};
        this.addRecipe = this.addRecipe.bind(this);
        this.handleRecipeInput = this.handleRecipeInput.bind(this);
        this.handleIngredientsInput = this.handleIngredientsInput.bind(this);
    }

    handleRecipeInput(e) {
        this.setState({recipeName: e.target.value});
    }

    handleIngredientsInput(e) {
        this.setState({ingredients: e.target.value});
    }

    addRecipe() {
        var ingredientsArray = this.state.ingredients.split(/[ ,]+/);
        var recipeName = this.state.recipeName;
        $('#recipeModal').modal('hide');
        $("#ingredients").val("");
        $("#recipe").val("");
        this.props.addRecipe(ingredientsArray, recipeName);
    }

    render() {
      return (
        <nav className="navbar navbar-light bg-light">
          <h4>Recipe Box</h4>
          <button className="btn btn-primary" data-toggle="modal" data-target="#recipeModal">Add    Recipe</button>  
          <div className="modal fade" id="recipeModal">
            <div className="modal-dialog" role="document">
              <div className="modal-content">  
                <div className="modal-header"><h5 className="modal-title"   id="recipeModalLabel">Add  a Recipe</h5></div>  
                <div className="modal-body text-left">
                  <label className="col-form-label">Recipe Name</label>
                  <input onChange={this.handleRecipeInput} type="text" className="form-control" id="recipe"/>
                  <label className="col-form-label">Ingredients</label>
                  <textarea placeholder="Enter ingredients separated by commas" onChange={this.handleIngredientsInput} type="text" className="form-control" id="ingredients"/>
                </div>  
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={this.addRecipe}>Add Recipe</button>
                  <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>  
              </div>
            </div>
          </div>
        </nav>
      )
    }
}

class Recipes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {listArray: []};
        this.editRecipe = this.editRecipe.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
        this.handleNewRecipe = this.handleNewRecipe.bind(this);
    }

    //stored in local storage, figure out how to use
    handleNewRecipe(ingredientsArray, recipeName) {
        localStorage.recipe = recipeName;
        localStorage.ingredients = ingredientsArray;            
        this.state.listArray.push({recipe: recipeName, ingredients: ingredientsArray});
        this.setState({recipe: recipeName, ingredients: ingredientsArray});
    }

    editRecipe(event) {
        var editedRecipe = $(event.target.parentNode.parentNode.childNodes[1].childNodes[1]).val();
        var editedIngredients = $(event.target.parentNode.parentNode.childNodes[1].childNodes[3]).val();
        $(event.target.parentNode.parentNode.parentNode.parentNode).modal('hide');

        var targetRecipe = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML;
        var arrayToEdit = this.state.listArray;
        arrayToEdit.forEach((recipe) => {
            if (recipe.recipe === targetRecipe) {
                recipe.recipe = editedRecipe;
                recipe.ingredients = editedIngredients.split(/[ ,]+/);
            }
        })
        this.setState({listArray: arrayToEdit});
    }

    deleteRecipe(event) {
        var targetCard = event.target.parentNode.parentNode.parentNode;
        var targetRecipe = targetCard.firstChild.firstChild.innerHTML;
        var arrayToSort = this.state.listArray;
        arrayToSort.forEach((recipe) => {
            if (recipe.recipe === targetRecipe) {
                var index = arrayToSort.indexOf(recipe);
                return arrayToSort.splice(index, 1);
            }
        })
        this.setState({listArray: arrayToSort});
    }

    render() {
        var allRecipes = this.state.listArray;
        var listOfIngredients = [];
        allRecipes.forEach((recipe) => {
            var recipeIngredients = [];
            recipe.ingredients.forEach((ingredient) => {
                recipeIngredients.push("<li class='list-group-item'>"+ingredient+"</li>");
            });
            listOfIngredients.push(recipeIngredients.join(''));
        })

        var recipesFormatted = allRecipes.map((recipe, i) => {
            return recipe = 
            <div className="card" id={'heading'+(i+1)}>
            <div className="card-header" id={'heading'+(i+1)}>
              <button className="btn btn-link" data-toggle="collapse" data-target={'#'+'collapse'+(i+1)}   aria-controls={'collapse'+(i+1)}>{recipe.recipe}</button>
            </div>
            <div id={'collapse'+(i+1)} className="collapse" aria-labelledby={'heading'+(i+1)}   data-parent="#accordion">
              <div className="card-body">
                <p><b>Ingredients</b></p><hr/>
                <ul className="list-group" dangerouslySetInnerHTML={{__html: listOfIngredients[i]}}/>
                <button className="btn btn-danger" onClick={this.deleteRecipe}>Delete</button>
                <button className="btn btn-warning" data-toggle="modal" data-target={"#editModal"+(i+1)}>Edit</button>

                <div className="modal fade" id={"editModal"+(i+1)}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">  
                      <div className="modal-header"><h5 className="modal-title"   id="recipeModalLabel">Edit Recipe</h5></div>  
                      <div className="modal-body text-left">
                        <label className="col-form-label">Recipe Name</label>
                        <input type="text" className="form-control" id="recipeEdit" defaultValue={recipe.recipe}/>
                        <label className="col-form-label">Ingredients</label>
                        <textarea type="text" className="form-control" id="ingredientsEdit" defaultValue={recipe.ingredients.join(',')}/>
                      </div>  
                      <div className="modal-footer">
                        <button className="btn btn-primary" onClick={this.editRecipe}>Confirm</button>
                        <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>  
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        });

        return (
        <div>
          <Navbar addRecipe={this.handleNewRecipe}/>
          <div className="jumbotron col-lg-10 offset-lg-1">
            <div className="panel-group" id="accordion">{recipesFormatted}</div>
          </div>
        </div>
        )
    }
}

ReactDOM.render(
    <Container />,
    document.getElementById('root')
)