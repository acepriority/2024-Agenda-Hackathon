from django.db import models


class PestsAndDiseases(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(
        null=True,
        blank=True,
        upload_to='pestanddiseases')

    def __str__(self):
        return self.name

    def get_symptoms(self):
        return self.symptoms.all()

    def get_treatment_guidelines(self):
        return self.treatment_guidelines.all()


class Symptoms(models.Model):
    pest_disease = models.ForeignKey(
                    PestsAndDiseases,
                    on_delete=models.CASCADE,
                    related_name='symptoms')
    symptom = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.symptom} ({self.pest_disease.name})"


class Transmission(models.Model):
    pest_disease = models.ForeignKey(
                    PestsAndDiseases,
                    on_delete=models.CASCADE,
                    related_name='transmissions')
    method = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.method} ({self.pest_disease.name})"


class TreatmentGuidelines(models.Model):
    pest_disease = models.ForeignKey(
                    PestsAndDiseases,
                    on_delete=models.CASCADE,
                    related_name='treatment_guidelines')
    guideline = models.CharField(max_length=255)

    def __str__(self):
        return f"Guideline for {self.pest_disease.name}"
