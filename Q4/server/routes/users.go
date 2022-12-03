package routes
import (
    "context"
    "fmt"
    "net/http"
    "time"    
    "server/models"
    "github.com/go-playground/validator/v10"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/bson"
    "github.com/gin-gonic/gin"
)
var validate = validator.New()
var userCollection *mongo.Collection = OpenCollection(Client, "users")

// Create User
func AddUser(c *gin.Context) {
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    var user models.User
    
    if err := c.BindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    validationErr := validate.Struct(user)
    if validationErr != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
        return
    }
    user.ID = primitive.NewObjectID()
  
    result, insertErr := userCollection.InsertOne(ctx, user)
    if insertErr != nil {
        msg := fmt.Sprintf("user item was not created")
        c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
        return
    }
    
    defer cancel()
    c.JSON(http.StatusOK, result)
}

// Get all users
func GetUsers(c *gin.Context){
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    var users []bson.M
    cursor, err := userCollection.Find(ctx, bson.M{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    if err = cursor.All(ctx, &users); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    
    defer cancel()
    
    fmt.Println(users)
    c.JSON(http.StatusOK, users)
}

// Get user by id
func GetUserById(c *gin.Context){
    userID := c.Params.ByName("id")
    docID, _ := primitive.ObjectIDFromHex(userID)
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    var user bson.M
    if err := userCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&user); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cancel()
    fmt.Println(user)
    c.JSON(http.StatusOK, user)
}

// Update user with id
func UpdateUser(c *gin.Context){
    userID := c.Params.ByName("id")
    docID, _ := primitive.ObjectIDFromHex(userID)
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    var user models.User
    if err := c.BindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    validationErr := validate.Struct(user)
    if validationErr != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
        return
    }
    result, err := userCollection.ReplaceOne(
        ctx,
        bson.M{"_id": docID},
        bson.M{
            "name":  user.Name,
            "email": user.Email,
            "phone": user.Phone,
            "address": user.Address,
        },
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
 
    defer cancel()
    c.JSON(http.StatusOK, result.ModifiedCount)
}

// Delete user with id
func DeleteUser(c * gin.Context){
    userID := c.Params.ByName("id")
    docID, _ := primitive.ObjectIDFromHex(userID)
    var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
    result, err := userCollection.DeleteOne(ctx, bson.M{"_id": docID})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer cancel()
    c.JSON(http.StatusOK, result.DeletedCount)
}