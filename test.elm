module Main exposing (main)

import Browser
import Dict exposing (Dict)
import Html exposing (..)
import Html.Attributes
import Html.Events exposing (onClick, onInput)
import List.Extra


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }



-- MODEL


type alias Model =
    { raw : String, parsed : Result FullParseError Expression }


initialModel : Model
initialModel =
    { raw = "", parsed = Err ( MissingEquals, "" ) }



-- UPDATE


type Msg
    = UserTyped String
    | ParseClicked


update : Msg -> Model -> Model
update msg model =
    case msg of
        UserTyped val ->
            { model | raw = val }

        ParseClicked ->
            { model | parsed = parseExpression model.raw }



-- VIEW


view : Model -> Html Msg
view { raw, parsed } =
    div []
        [ section []
            [ h2 [] [ text "Input" ]
            , p [] [ text "Enter a formula here" ]
            , p []
                [ input [ onInput UserTyped, Html.Attributes.value raw ] []
                , button [ onClick ParseClicked ] [ text "Parse" ]
                ]
            ]
        , section []
            [ h2 [] [ text "Output" ]
            , p [] [ text <| parsedContents parsed ]
            ]
        , section []
            [ h2 [] [ text "Debug" ]
            , p [] [ text <| Debug.toString parsed ]
            ]
        ]


parsedContents : Result FullParseError Expression -> String
parsedContents result =
    case result of
        Ok expr ->
            String.fromInt <| eval expr

        Err error ->
            errorMessage error



-- EXPRESSION


type Expression
    = Literal Int
    | Operation OpName Expression Expression


type OpName
    = Add
    | Times


eval : Expression -> Int
eval expr =
    case expr of
        Literal n ->
            n

        Operation op left right ->
            applyOp op (eval left) (eval right)


applyOp : OpName -> Int -> Int -> Int
applyOp op x y =
    case op of
        Add ->
            x + y

        Times ->
            x * y


type alias FullParseError =
    ( ParseErr, String )


type ParseErr
    = MissingOpenParen
    | MissingCloseParen
    | InvalidOperation String
    | MissingComma
    | ParseDontValidate
    | BadSuffix String
    | MissingEquals


errorMessage : FullParseError -> String
errorMessage ( err, string ) =
    parseErrorToString err ++ " in: " ++ string


parseErrorToString : ParseErr -> String
parseErrorToString err =
    case err of
        MissingOpenParen ->
            "Expected open paren"

        MissingCloseParen ->
            "Expected close paren"

        MissingComma ->
            "Expected comma"

        InvalidOperation opName ->
            opName ++ "is not a valid operation"

        ParseDontValidate ->
            "Parse; don't validate! This should never happen"

        MissingEquals ->
            "Formulas should start with an equals"

        BadSuffix suffix ->
            "Invalid value '" ++ suffix ++ "' found at the end"


opTokens : Dict String OpName
opTokens =
    Dict.fromList
        [ ( "add", Add )
        , ( "times", Times )
        ]


parseExpression : String -> Result FullParseError Expression
parseExpression preTrimmedRaw =
    let
        raw =
            String.trim preTrimmedRaw
    in
    case String.toInt raw of
        Just n ->
            Ok (Literal n)

        Nothing ->
            case String.startsWith "=" raw of
                False ->
                    Err ( MissingEquals, raw )

                True ->
                    case parseHelp <| String.dropLeft 1 raw of
                        Ok ( expr, "" ) ->
                            Ok expr

                        Ok ( _, suffix ) ->
                            Err ( BadSuffix suffix, raw )

                        Err err ->
                            Err err


parseHelp : String -> Result FullParseError ( Expression, String )
parseHelp preTrimmedRaw =
    let
        raw =
            String.trim preTrimmedRaw
    in
    case List.Extra.takeWhile Char.isDigit <| String.toList raw of
        [] ->
            case String.split "(" raw of
                [] ->
                    Err ( MissingOpenParen, raw )

                all :: [] ->
                    Err ( MissingOpenParen, raw )

                opName :: afterOp ->
                    case Dict.get opName opTokens of
                        Nothing ->
                            Err ( InvalidOperation opName, raw )

                        Just op ->
                            case parseHelp <| String.join "(" afterOp of
                                Err err ->
                                    Err err

                                Ok ( leftExpr, afterLeft ) ->
                                    case String.startsWith "," <| String.trim afterLeft of
                                        False ->
                                            Err ( MissingComma, String.trim afterLeft )

                                        True ->
                                            case parseHelp <| String.dropLeft 1 <| String.trim afterLeft of
                                                Err err ->
                                                    Err err

                                                Ok ( rightExpr, afterRight ) ->
                                                    case String.startsWith ")" <| String.trim afterRight of
                                                        False ->
                                                            Err ( MissingCloseParen, String.trim afterRight )

                                                        True ->
                                                            Ok ( Operation op leftExpr rightExpr, String.dropLeft 1 <| String.trim afterRight )

        digits ->
            case String.toInt <| String.fromList digits of
                Nothing ->
                    Err ( ParseDontValidate, String.fromList digits )

                Just n ->
                    Ok ( Literal n, String.dropLeft (List.length digits) raw )
