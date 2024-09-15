import cohere
from cohere import ClassifyExample

examples = [
    ClassifyExample(text="I Dont know what's going on", label="NoConf"),
    ClassifyExample(text="I'm not sure what to do", label="NoConf"),
    ClassifyExample(
        text="I am going and going and going", label="NoConf"),
    ClassifyExample(text="Hello! My name is John.", label="Conf"),
    ClassifyExample(text="I am going to the place and teaching", label="NoConf"),
    ClassifyExample(text="Your parcel will be delivered today",
                    label="Conf"),
    ClassifyExample(
        text="Review changes to our Terms and Conditions", label="Conf"
    ),
    ClassifyExample(text="Weekly sync notes", label="Conf"),
    ClassifyExample(text="We desire to be loved",
                    label="Conf"),
    ClassifyExample(text="One two three four", label="Conf"),
    ClassifyExample(text="That's what I'm going to do.", label="NoConf"),
    ClassifyExample(text="That's what I'm doing.", label="NoConf"),
    ClassifyExample(text="I like Apples", label="Conf"),
]