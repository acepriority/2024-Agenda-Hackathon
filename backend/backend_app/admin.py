from django.contrib import admin
from .models import (
    PestsAndDiseases,
    Symptoms,
    Transmission,
    TreatmentGuidelines
    )


@admin.register(PestsAndDiseases)
class PestsAndDiseasesAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    list_filter = ('name',)


@admin.register(Symptoms)
class SymptomsAdmin(admin.ModelAdmin):
    list_display = ('pest_disease', 'symptom')
    search_fields = ('pest_disease', 'symptom')
    list_filter = ('pest_disease', 'symptom')


@admin.register(Transmission)
class TransmissionAdmin(admin.ModelAdmin):
    list_display = ('pest_disease', 'method')
    search_fields = ('pest_disease',)
    list_filter = ('pest_disease',)


@admin.register(TreatmentGuidelines)
class TreatmentGuidelinesAdmin(admin.ModelAdmin):
    list_display = ('pest_disease', 'guideline')
    search_fields = ('pest_disease',)
    list_filter = ('pest_disease',)
